import 'dotenv/config';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import Exhibit from '../models/Exhibit.js';

// Same DNS fix as config/db.js — link-local IPv6 DNS breaks mongodb+srv lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const CLIENT_BASE_URL = 'http://localhost:5173';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/museum150');
  console.log('Connected to MongoDB');

  const exhibits = await Exhibit.find({});
  let fixed = 0;

  for (const exhibit of exhibits) {
    const currentFile = exhibit.qrCodeUrl ? path.join('uploads', path.basename(exhibit.qrCodeUrl)) : null;
    const exists = currentFile && fs.existsSync(currentFile);

    if (exists) {
      console.log(`OK   ${exhibit.title} -> ${exhibit.qrCodeUrl}`);
      continue;
    }

    const qrFilename = `qr-${exhibit._id}.png`;
    const qrPath = path.join('uploads', qrFilename);
    const clientUrl = `${CLIENT_BASE_URL}/exhibit/${exhibit._id}`;

    await QRCode.toFile(qrPath, clientUrl, {
      color: { dark: '#4E342E', light: '#F7F2E9' }
    });

    exhibit.qrCodeUrl = `/uploads/${qrFilename}`;
    await exhibit.save();
    fixed += 1;
    console.log(`FIXED ${exhibit.title} -> ${exhibit.qrCodeUrl}`);
  }

  console.log(`\nDone. Regenerated ${fixed} of ${exhibits.length} QR codes.`);
  await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });
