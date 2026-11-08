import express from 'express';
import path from 'path';
import upload from '../middleware/uploadMiddleware.js';
import Media from '../models/Media.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { r2Enabled, uploadBufferToR2, createPresignedPutUrl, r2PublicUrl } from '../config/r2.js';

const router = express.Router();

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // matches uploadMiddleware's limit

// Content type and media-library type for every extension we accept. Taken
// from the extension rather than the browser, which reports blank or generic
// types for 3D models.
const FILE_TYPES = {
  '.jpg': ['image/jpeg', 'image'],
  '.jpeg': ['image/jpeg', 'image'],
  '.png': ['image/png', 'image'],
  '.gif': ['image/gif', 'image'],
  '.mp3': ['audio/mpeg', 'audio'],
  '.wav': ['audio/wav', 'audio'],
  '.mp4': ['video/mp4', 'video'],
  '.mpeg': ['video/mpeg', 'video'],
  '.pdf': ['application/pdf', 'pdf'],
  '.glb': ['model/gltf-binary', 'model'],
  '.gltf': ['model/gltf+json', 'model'],
  '.usdz': ['model/vnd.usdz+zip', 'model'],
};

const uniqueKey = (originalName) =>
  `file-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(originalName).toLowerCase()}`;

// Step 1 of a direct upload: the browser asks for a short-lived signed URL and
// then PUTs the file straight to R2, so large files (3D models, audio) never
// pass through the API, whose request bodies are capped at 4.5 MB on Vercel.
router.post('/upload-url', protect, adminOnly, (req, res) => {
  if (!r2Enabled) {
    return res.status(501).json({ success: false, message: 'Direct uploads need R2 to be configured' });
  }
  const { name, size } = req.body || {};
  const fileType = typeof name === 'string' && FILE_TYPES[path.extname(name).toLowerCase()];
  if (!fileType) {
    return res.status(400).json({ success: false, message: 'Format not supported! Supports images, audio, video, PDFs, GLB/glTF, and USDZ 3D models.' });
  }
  if (Number(size) > MAX_UPLOAD_BYTES) {
    return res.status(400).json({ success: false, message: 'File is too large (50 MB max).' });
  }
  const key = uniqueKey(name);
  const [contentType] = fileType;
  res.json({ success: true, uploadUrl: createPresignedPutUrl(key, contentType), url: r2PublicUrl(key), contentType });
});

// Step 2 of a direct upload: record the uploaded file in the media library.
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, url, size } = req.body || {};
    const fileType = typeof name === 'string' && FILE_TYPES[path.extname(name).toLowerCase()];
    if (!fileType || typeof url !== 'string' || !r2Enabled || !url.startsWith(r2PublicUrl(''))) {
      return res.status(400).json({ success: false, message: 'Invalid upload' });
    }
    const media = await Media.create({
      name,
      url,
      type: fileType[1],
      size: Number(size) || 0,
      uploadedBy: req.user._id
    });
    res.status(201).json({ success: true, url, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload through the API in one request. Still used when R2 isn't configured
// (local development); on Vercel it only works for files under 4.5 MB.
router.post('/upload', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const key = uniqueKey(req.file.originalname);

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
