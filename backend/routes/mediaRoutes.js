import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import Media from '../models/Media.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const media = await Media.create({
      name: req.file.originalname,
      url: fileUrl,
      type: req.file.mimetype.split('/')[0] === 'application' ? 'pdf' : req.file.mimetype.split('/')[0],
      size: req.file.size,
      uploadedBy: req.user._id
    });

    res.status(201).json({ success: true, url: fileUrl, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const mediaList = await Media.find({}).populate('uploadedBy', 'name');
    res.json({ success: true, count: mediaList.length, data: mediaList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
