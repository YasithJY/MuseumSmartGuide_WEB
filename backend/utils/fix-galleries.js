/**
 * fix-galleries.js
 * Removes all galleries from DB and inserts only "Engineering Heritage Gallery".
 * Also clears exhibits that referenced the old galleries (to keep DB consistent).
 * Run: node utils/fix-galleries.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Gallery from '../models/Gallery.js';
import Exhibit from '../models/Exhibit.js';
import Museum from '../models/Museum.js';

dotenv.config();

const run = async () => {
  await connectDB();

  // 1. Delete all existing exhibits (they reference old galleries)
  await Exhibit.deleteMany({});
  console.log('✓ All exhibits cleared.');

  // 2. Delete all existing galleries
  await Gallery.deleteMany({});
  console.log('✓ All galleries cleared.');

  // 3. Get the museum to attach to
  const museum = await Museum.findOne({});
  if (!museum) {
    console.error('✗ No museum found. Run seeder first: npm run seed');
    process.exit(1);
  }

  // 4. Create Engineering Heritage Gallery
  const engineeringGallery = await Gallery.create({
    name: 'Engineering Heritage Gallery',
    description: 'Showcasing Sri Lanka\'s engineering milestones — from ancient hydraulic irrigation systems and reservoirs to colonial-era bridges, railways, and modern infrastructure. A tribute to 150 years of engineering excellence.',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
    museumId: museum._id,
    exhibitsCount: 0,
    translations: {
      si: {
        name: 'ඉංජිනේරු උරුම ගැලරිය',
        description: 'ශ්‍රී ලංකාවේ ඉංජිනේරු සන්ධිස්ථාන — පුරාණ ජල කළමනාකරණ පද්ධති සිට යටත් විජිත යුගයේ පාලම්, දුම්රිය මාර්ග සහ නවීන යටිතල පහසුකම් දක්වා ප්‍රදර්ශනය කරයි.'
      },
      ta: {
        name: 'பொறியியல் பாரம்பரிய கேலரி',
        description: 'இலங்கையின் பொறியியல் மைல்கற்கள் — பண்டைய நீர்ப்பாசன அமைப்புகள் முதல் காலனித்துவ பாலங்கள், இரயில் பாதைகள் மற்றும் நவீன உள்கட்டமைப்பு வரை காட்சிப்படுத்துகிறது.'
      }
    }
  });

  // 5. Update museum gallery count
  await Museum.findByIdAndUpdate(museum._id, { galleriesCount: 1 });

  console.log(`✓ "Engineering Heritage Gallery" created (ID: ${engineeringGallery._id})`);
  console.log('\n✅ Done! You can now add exhibits from the Admin Dashboard.');
  process.exit(0);
};

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
