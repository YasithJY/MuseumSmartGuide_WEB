import express from 'express';
import path from 'path';
import upload from '../middleware/uploadMiddleware.js';
import Media from '../models/Media.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { r2Enabled, uploadBufferToR2 } from '../config/r2.js';

const router = express.Router();

router.post('/upload', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const key = `${req.file.fieldname}-${uniqueSuffix}${path.extname(req.file.originalname)}`;

    // With R2 configured the file arrives in memory (see uploadMiddleware);
    // otherwise multer already wrote it to local disk under /uploads.
    const fileUrl = r2Enabled
      ? await uploadBufferToR2(req.file.buffer, key, req.file.mimetype)
      : `/uploads/${req.file.filename}`;

    const isModelFile = /\.(glb|gltf|usdz)$/i.test(req.file.originalname);
    const type = isModelFile
      ? 'model'
      : req.file.mimetype.split('/')[0] === 'application' ? 'pdf' : req.file.mimetype.split('/')[0];
    const media = await Media.create({
      name: req.file.originalname,
      url: fileUrl,
      type,
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
