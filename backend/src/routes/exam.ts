// backend/routes/exam.ts
import express from 'express';
import Question from '../models/Question';
import { calculateResultAndCert } from '../services/exam'; // your existing function
import { generateCertificatePdf } from '../services/cert';
import User from '../models/User';
import { submitExam } from "../../controllers/examController";
import Certificate from '../models/Certificate';
import Answer from '../models/Answer'; // optional - if you have this model
const router = express.Router();

// GET questions for a step (unchanged)
router.get('/questions/:step', async (req, res) => {
  try {
    const step = Number(req.params.step) || 1;
    const mapping: Record<number, string[]> = { 1: ['A1', 'A2'], 2: ['B1', 'B2'], 3: ['C1', 'C2'] };
    const levels = mapping[step] || ['A1', 'A2'];
    const qs = await Question.find({ level: { $in: levels } }).limit(44);
    res.json({ questions: qs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST submit
router.post('/submit', async (req, res) => {
  try {
    const { answers, step, userId } = req.body;
    if (!Array.isArray(answers)) return res.status(400).json({ message: 'Bad request' });

    // grade using your helper (returns total, correct, percent, certificateLevel)
    const result = await calculateResultAndCert(answers, Number(step));

    // Optionally save individual answers (if you have an Answer model)
    try {
      for (const a of answers) {
        // only save if Answer model exists. If not, this will throw; wrap in try/catch
        await Answer.create({
          userId,
          step,
          questionId: a.questionId,
          chosenIndex: a.chosenIndex,
          isCorrect: false // will update below if we can check; simple approach:
        });
      }
    } catch (saveErr) {
      // not critical — ignore if Answer model wasn't added / available
      // console.warn('Could not save answers:', saveErr.message);
    }

    let certUrl: string | null = null;
    let lifetimeCertUrl: string | null = null;

    // If there is a certificateLevel (per step), generate a PDF and store record
    if (result.certificateLevel) {
      try {
        certUrl = await generateCertificatePdf(userId || 'anonymous', result.certificateLevel);
        await Certificate.create({ userId, level: result.certificateLevel, certUrl, lifetime: false });
      } catch (e) {
        console.error('Failed to create step certificate:', e);
      }
    }

    // Final lifetime certificate logic for step 3:
    if (Number(step) === 3) {
      // Define your "lifetime" criteria. Example: certificateLevel contains 'C2' OR percent >= 75
      const qualifiesForLifetime =
        (result.certificateLevel && /C2/i.test(result.certificateLevel)) ||
        (typeof result.percent === 'number' && result.percent >= 75);

      if (qualifiesForLifetime) {
        try {
          lifetimeCertUrl = await generateCertificatePdf(userId || 'anonymous', 'Lifetime Professional Certificate');
          await Certificate.create({ userId, level: 'Lifetime Professional', certUrl: lifetimeCertUrl, lifetime: true });
        } catch (e) {
          console.error('Failed to create lifetime certificate:', e);
        }
      }
    }

    // Determine allowProceed (business rule). Example: percent >= 50
    const allowProceed = typeof result.percent === 'number' ? result.percent >= 50 : false;

    return res.json({
      ...result,
      certUrl,
      lifetimeCertUrl,
      allowProceed
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
