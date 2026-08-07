import mongoose from 'mongoose';

const museumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, default: '' },
  openingHours: {
    weekdays: { type: String, default: '09:00 AM - 05:00 PM' },
    weekends: { type: String, default: '09:00 AM - 06:00 PM' }
  },
  location: {
    address: { type: String, default: 'Sir Marcus Fernando Mawatha, Colombo 00700, Sri Lanka' },
    lat: { type: Number, default: 6.9113 },
    lng: { type: Number, default: 79.8654 }
  },
  galleriesCount: { type: Number, default: 0 }
}, { timestamps: true });

const Museum = mongoose.model('Museum', museumSchema);
export default Museum;
