import 'dotenv/config';
import dns from 'dns';
import fs from 'fs';
import os from 'os';
import path from 'path';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import Museum from '../models/Museum.js';
import Gallery from '../models/Gallery.js';
import Exhibit from '../models/Exhibit.js';
import Category from '../models/Category.js';
import { r2Enabled, uploadBufferToR2 } from '../config/r2.js';
import {
  HERITAGE_CATEGORIES,
  buildHeritageGalleries,
  buildHeritageExhibits,
} from './data/heritageExhibits.js';

// Adds two galleries and their four exhibits to the database in MONGODB_URI:
// Nadungamuwa Raja (National Museum of Colombo), and Isurumuniya Lovers,
// Nagaraja Guardstone and Statue of King Parakramabahu (Polonnaruwa
// Archaeological Museum). Unlike seeder.js it deletes
// nothing, and it is safe to re-run: records are upserted by their fixed IDs,
// and an audio URL already set from the dashboard is left alone.
//
//   node utils/addHeritageExhibits.js
//
// When the R2_* env vars are set it also uploads the QR codes and the 3D
// models (from MODELS_DIR, default ~/Downloads/Museum3D) to R2. Without them,
// QR codes are written to ./uploads and the models must be uploaded by hand.

// Same DNS fix as config/db.js — link-local IPv6 DNS breaks mongodb+srv lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const CLIENT_URL = process.env.CLIENT_URL || 'https://lkmuseum150.vercel.app';
const MODELS_DIR = process.env.MODELS_DIR || path.join(os.homedir(), 'Downloads', 'Museum3D');
const MUSEUM_NAMES = { colombo: 'National Museum of Colombo', polonnaruwa: 'Polonnaruwa Archaeological Museum' };

// Source file (relative to MODELS_DIR) -> key under models/ on R2. The
// frontend's AR_MODEL_BY_EXHIBIT_ID (pages/Exhibit.jsx) expects these names.
const MODEL_FILES = [
  ['Nadungamuwa Raja/nadungamuwa-raja.glb', 'nadungamuwa-raja.glb'],
  ['Nadungamuwa Raja/nadungamuwa-raja.usdz', 'nadungamuwa-raja.usdz'],
  ['Isurumuni Pem Yuwala/isurumuni.glb', 'isurumuni.glb'],
  ['Isurumuni Pem Yuwala/isurumuni.usdz', 'isurumuni.usdz'],
  ['Muragala/muragala.glb', 'muragala.glb'],
  ['Muragala/muragala.usdz', 'muragala.usdz'],
  ['Parakramabahu I/Parakramabahu.glb', 'Parakramabahu.glb'],
  ['Parakramabahu I/parakramabahu.usdz', 'parakramabahu.usdz'],
];
const MODEL_CONTENT_TYPES = { '.glb': 'model/gltf-binary', '.usdz': 'model/vnd.usdz+zip' };

const saveQRCode = async (exhibitId) => {
  const clientUrl = `${CLIENT_URL}/exhibit/${exhibitId}`;
  const qrFilename = `qr-${exhibitId}.png`;
  const qrOptions = { color: { dark: '#4E342E', light: '#F7F2E9' } };
  if (r2Enabled) {
    const buffer = await QRCode.toBuffer(clientUrl, qrOptions);
    return uploadBufferToR2(buffer, qrFilename, 'image/png');
  }
  await QRCode.toFile(path.join('uploads', qrFilename), clientUrl, qrOptions);
  return `/uploads/${qrFilename}`;
};

const uploadModels = async () => {
  if (!r2Enabled) {
    console.log('\nR2 is not configured, so the 3D models were not uploaded.');
    console.log('Upload these files to the bucket\'s models/ folder:');
    MODEL_FILES.forEach(([src, key]) => console.log(`  ${path.join(MODELS_DIR, src)}  ->  models/${key}`));
    return;
  }
  for (const [src, key] of MODEL_FILES) {
    const file = path.join(MODELS_DIR, src);
    if (!fs.existsSync(file)) {
      console.warn(`Model not found, skipped: ${file}`);
      continue;
    }
    const contentType = MODEL_CONTENT_TYPES[path.extname(key).toLowerCase()];
    const url = await uploadBufferToR2(fs.readFileSync(file), `models/${key}`, contentType);
    console.log(`Uploaded model ${key} -> ${url}`);
  }
};

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/museum150');
  console.log(`Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);

  const museumIds = {};
  for (const [key, name] of Object.entries(MUSEUM_NAMES)) {
    const museum = await Museum.findOne({ name }).select('_id');
    if (!museum) throw new Error(`Museum "${name}" not found — nothing was changed.`);
    museumIds[key] = museum._id;
  }

  // Categories are unique by name, so match on name and keep whatever ID an
  // existing category already has.
  const categoryIdMap = {};
  for (const { _id, name, ...fields } of HERITAGE_CATEGORIES) {
    await Category.updateOne({ name }, { $set: fields, $setOnInsert: { _id } }, { upsert: true });
    const saved = await Category.findOne({ name }).select('_id');
    categoryIdMap[_id.toString()] = saved._id;
    console.log(`Category: ${name}`);
  }

  const galleries = buildHeritageGalleries(museumIds);
  for (const { _id, exhibitsCount, ...galleryFields } of galleries) {
    await Gallery.updateOne({ _id }, { $set: galleryFields }, { upsert: true });
    console.log(`Gallery: ${galleryFields.name}`);
  }

  for (const { _id, ...fields } of buildHeritageExhibits(museumIds)) {
    fields.categoryId = categoryIdMap[fields.categoryId.toString()];
    fields.qrCodeUrl = await saveQRCode(_id);
    await Exhibit.updateOne(
      { _id },
      { $set: fields, $setOnInsert: { audioUrl: '', arModelUrl: '', arModelUrlIOS: '' } },
      { upsert: true, runValidators: true }
    );
    console.log(`Exhibit: ${fields.title}  (${CLIENT_URL}/exhibit/${_id})`);
  }

  // Recount rather than increment so re-running never double-counts.
  for (const { _id: galleryId } of galleries) {
    await Gallery.updateOne({ _id: galleryId }, { exhibitsCount: await Exhibit.countDocuments({ galleryId }) });
  }
  for (const museumId of Object.values(museumIds)) {
    await Museum.updateOne({ _id: museumId }, { galleriesCount: await Gallery.countDocuments({ museumId }) });
  }

  await uploadModels();

  console.log('\nDone.');
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err.message || err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
