// backend/routes/admin.ts
import express from 'express';
import User from '../models/User';
import Answer from '../models/Answer';
import Certificate from '../models/Certificate';
import { verifyAccessToken } from '../services/jwt'; // your jwt service
import mongoose from 'mongoose';

const router = express.Router();

// simple auth middleware using access token bearer (you likely have one, adapt accordingly)
function adminAuth(req:any, res:any, next:any){
  try{
    const auth = req.headers['authorization'];
    if(!auth) return res.status(401).json({message:'No token'});
    const token = auth.split(' ')[1];
    const payload:any = verifyAccessToken(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    if(payload.role !== 'admin') return res.status(403).json({message:'Forbidden'});
    req.user = payload;
    next();
  }catch(err){
    console.error(err);
    return res.status(401).json({message:'Auth failed'});
  }
}

// get analytics summary
router.get('/analytics', adminAuth, async (req,res)=>{
  try{
    // total users
    const totalUsers = await User.countDocuments();
    // how many finished step1/2/3 (aggregate by answers)
    const steps = await Answer.aggregate([
      { $group: { _id: "$step", users: { $addToSet: "$userId" }, count: { $sum: 1 } } }
    ]);
    const certificates = await Certificate.find().populate('userId','name email role');

    // Basic per-user summary (last percent etc.)
    const perUser = await Answer.aggregate([
      { $group: {
        _id: { userId: "$userId", step: "$step" },
        total: { $sum: 1 },
        correct: { $sum: { $cond: ["$isCorrect",1,0] } }
      }},
      { $group: {
        _id: "$_id.userId",
        steps: { $push: { step: "$_id.step", total: "$total", correct: "$correct", percent: { $multiply: [{ $divide: ["$correct", "$total"] }, 100] } } }
      }}
    ]);

    res.json({
      totalUsers,
      steps,
      certificates,
      perUser
    });
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

export default router;
