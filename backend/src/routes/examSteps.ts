// backend/src/routes/examSteps.ts
import express from 'express';
import User from '../models/User';
import { authMiddleware } from '../middleware/authMiddleware'; // uses req.user.id

const router = express.Router();

/**
 * GET /api/exam/eligibility
 * Returns completedSteps and boolean flags whether user is eligible for step2/step3
 */
router.get('/eligibility', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const completed = (user.completedSteps || []) as number[];

    // Eligibility rules:
    // - eligible for Step 2 if Step 1 is completed
    // - eligible for Step 3 if Step 2 is completed
    const eligibleForStep2 = completed.includes(1);
    const eligibleForStep3 = completed.includes(2);

    return res.json({
      completedSteps: completed,
      eligibleForStep2,
      eligibleForStep3,
    });
  } catch (err) {
    console.error('eligibility error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/exam/start/:step
 * Lightweight endpoint that indicates a user is starting a step.
 * We don't alter exam flow here; it's just useful for analytics / starting sessions.
 */
router.post('/start/:step', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const step = Number(req.params.step || 0);
    if (![1, 2, 3].includes(step)) {
      return res.status(400).json({ message: 'Invalid step' });
    }

    // OPTIONAL: if you want to record "startedAt" or create a session, do it here.
    // For now we just return ok and the client will navigate to /exam/:step
    return res.json({ ok: true, step });
  } catch (err) {
    console.error('start exam error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
