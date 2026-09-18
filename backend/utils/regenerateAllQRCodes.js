import 'dotenv/config';
import dns from 'dns';
import path from 'path';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import Exhibit from '../models/Exhibit.js';
import { r2Enabled, uploadBufferToR2 } from '../config/r2.js';

// Same DNS fix as config/db.js — link-local IPv6 DNS breaks mongodb+srv lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Unlike fixMissingQRCodes.js (which only regenerates a QR if the file is
// literally missing), this forces a regeneration for every exhibit so the
// QR's embedded link is updated after CLIENT_URL changes (e.g. localhost ->
// production domain) — the old files already exist, they just point
// visitors to the wrong place.
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const run = async () => {
  if (!r2Enabled) {
    console.error('R2 is not configured — this script assumes QR codes live on R2.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/museum150');
  console.log(`Connected to MongoDB. Regenerating QR codes with CLIENT_URL=${CLIENT_URL}`);

  const exhibits = await Exhibit.find({});
  for (const exhibit of exhibits) {
    const clientUrl = `${CLIENT_URL}/exhibit/${exhibit._id}`;
    const qrFilename = `qr-${exhibit._id}.png`;
    const buffer = await QRCode.toBuffer(clientUrl, {
      color: { dark: '#4E342E', light: '#F7F2E9' }
    });
    exhibit.qrCodeUrl = await uploadBufferToR2(buffer, qrFilename, 'image/png');
    await exhibit.save();
    console.log(`Regenerated ${exhibit.title} -> ${clientUrl}`);
  }

  console.log(`\nDone. Regenerated ${exhibits.length} QR codes.`);
  await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });
