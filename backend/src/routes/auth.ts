import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import { sendOtpEmail } from '../services/otp';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/jwt';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Multer config for photo upload
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash, phone, role });

    const otp = await sendOtpEmail(email);

    return res.json({ message: 'User created', userId: user._id, otpSent: !!otp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const access = signAccessToken({ id: user._id, role: user.role });
    const refresh = signRefreshToken({ id: user._id, role: user.role });

    user.refreshToken = refresh;
    await user.save();

    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const profilePhoto = user.profilePhoto ? `${base}/uploads/${path.basename(user.profilePhoto)}` : null;

    res.json({
      accessToken: access,
      refreshToken: refresh,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone || null,
        profilePhoto,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// upload profile photo
router.post('/profile-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePhoto = req.file.path;
    await user.save();

    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.json({ profilePhoto: `${base}/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
