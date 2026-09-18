import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { r2Enabled } from '../config/r2.js';

const uploadDir = './uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// When R2 is configured, buffer the file in memory so the route handler can
// stream it straight to R2 instead of the local (ephemeral, on most free
// hosts) disk. Without R2 configured, fall back to local disk so uploads
// still work in plain local dev.
const storage = r2Enabled
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp3|wav|mp4|mpeg|pdf|glb|gltf|usdz/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  // Browsers report inconsistent/generic mimetypes for .glb/.gltf/.usdz
  // (often "application/octet-stream" or blank), so mimetype sniffing isn't
  // reliable for those — trust the extension check alone for them. Other
  // types still need both checks to match.
  const isModelFile = /\.(glb|gltf|usdz)$/i.test(file.originalname);
  const mimetype = isModelFile || allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Format not supported! Supports images, audio, video, PDFs, GLB/glTF, and USDZ 3D models.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max limit
  fileFilter: fileFilter
});

export default upload;
