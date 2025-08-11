// backend/routes/certificate.ts
import express from 'express';
import Certificate from '../models/Certificate';
import User from '../models/User';
import mongoose from 'mongoose';

const router = express.Router();

// GET certificate metadata by id (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const cert = await Certificate.findById(id).populate('userId', 'name email');
    if (!cert) return res.status(404).json({ message: 'Not found' });
    res.json(cert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
