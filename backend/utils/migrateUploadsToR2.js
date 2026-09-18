import 'dotenv/config';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Exhibit from '../models/Exhibit.js';
import Media from '../models/Media.js';
import { r2Enabled, uploadBufferToR2 } from '../config/r2.js';

// Same DNS fix as config/db.js — link-local IPv6 DNS breaks mongodb+srv lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const uploadDir = './uploads';

const CONTENT_TYPES = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
};

const run = async () => {
  if (!r2Enabled) {
    console.error('R2 is not configured — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL in backend/.env first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/museum150');
  console.log('Connected to MongoDB');

  const files = fs.readdirSync(uploadDir).filter(f => fs.statSync(path.join(uploadDir, f)).isFile());
  console.log(`Found ${files.length} local files in ${uploadDir}`);

  // oldUrl (as stored in the DB, e.g. "/uploads/sigiriya-1.png") -> new R2 URL
  const urlMap = {};

  for (const filename of files) {
    const ext = path.extname(filename).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
    const buffer = fs.readFileSync(path.join(uploadDir, filename));
    const newUrl = await uploadBufferToR2(buffer, filename, contentType);
    urlMap[`/uploads/${filename}`] = newUrl;
    console.log(`Uploaded ${filename} -> ${newUrl}`);
  }

  const remap = (url) => (url && urlMap[url]) || url;

  const exhibits = await Exhibit.find({});
  let exhibitsUpdated = 0;
  for (const exhibit of exhibits) {
    const before = JSON.stringify({ audioUrl: exhibit.audioUrl, videoUrl: exhibit.videoUrl, qrCodeUrl: exhibit.qrCodeUrl, images: exhibit.images });
    exhibit.audioUrl = remap(exhibit.audioUrl);
    exhibit.videoUrl = remap(exhibit.videoUrl);
    exhibit.qrCodeUrl = remap(exhibit.qrCodeUrl);
    exhibit.images = (exhibit.images || []).map(remap);
    const after = JSON.stringify({ audioUrl: exhibit.audioUrl, videoUrl: exhibit.videoUrl, qrCodeUrl: exhibit.qrCodeUrl, images: exhibit.images });
    if (before !== after) {
      await exhibit.save();
      exhibitsUpdated += 1;
      console.log(`Updated exhibit: ${exhibit.title}`);
    }
  }

  const mediaDocs = await Media.find({});
  let mediaUpdated = 0;
  for (const media of mediaDocs) {
    const newUrl = remap(media.url);
    if (newUrl !== media.url) {
      media.url = newUrl;
      await media.save();
      mediaUpdated += 1;
    }
  }

  console.log(`\nDone. Uploaded ${files.length} files, updated ${exhibitsUpdated} exhibits and ${mediaUpdated} media records.`);
  console.log('Local files in backend/uploads were left in place as a backup — safe to delete once you\'ve verified the R2 URLs work.');
  await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });
