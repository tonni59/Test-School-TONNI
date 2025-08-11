// backend/controllers/analyticsController.ts
import { Request, Response } from "express";
import User from "../src/models/User";
import Result from "../src/models/Result";


export async function getUserAnalytics(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    const results = await Result.find({ userId }).sort({ createdAt: -1 });

    const totalAttempts = results.length;
    const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
    const totalWrong = totalQuestions - totalCorrect;
    const averagePercent =
      totalAttempts > 0
        ? Number((results.reduce((sum, r) => sum + r.percent, 0) / totalAttempts).toFixed(2))
        : 0;

    res.json({
      username: user.name,
      email: user.email,
      totalAttempts,
      totalQuestions,
      totalCorrect,
      totalWrong,
      averagePercent,
      attempts: results.map((r) => ({
        _id: r._id,
        step: r.step,
        total: r.total,
        correct: r.correct,
        wrong: r.total - r.correct,
        percent: r.percent,
        certificateLevel: r.certificateLevel,
        certUrl: r.certUrl || null,
        emailSent: r.emailSent || false,
        date: r.createdAt
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
