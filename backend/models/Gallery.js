import mongoose from 'mongoose';

// Language-specific content for a gallery
const galleryTranslationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, default: '' },
  museumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Museum', required: true },
  exhibitsCount: { type: Number, default: 0 },
  // Multilingual translations: Sinhala (si) and Tamil (ta)
  translations: {
    si: { type: galleryTranslationSchema, default: () => ({}) },
    ta: { type: galleryTranslationSchema, default: () => ({}) }
  }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;

