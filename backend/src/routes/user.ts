import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Ensure upload directory exists
const uploadBase = process.env.UPLOADS_PATH || 'storage/uploads';
const profileDir = path.join(process.cwd(), uploadBase, 'profiles');
fs.mkdirSync(profileDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileDir);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  },
});

const upload = multer({ storage });

function fullUrl(req: express.Request, relPath?: string | undefined) {
  if (!relPath) return null;
  // If APP_BASE_URL is configured in env, prefer that
  const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
  // relPath is expected to start with '/'
  return `${base}${relPath}`;
}

// GET /api/user/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: 'No user' });

    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePhoto: user.profilePhoto ? fullUrl(req, user.profilePhoto) : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/me -- multipart form-data (field: photo)
router.put('/me', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: 'No user' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (req.file) {
      // save relative URL so it works across environments
      const rel = `/uploads/profiles/${req.file.filename}`;
      user.profilePhoto = rel;
    }

    await user.save();

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePhoto: user.profilePhoto ? fullUrl(req, user.profilePhoto) : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;