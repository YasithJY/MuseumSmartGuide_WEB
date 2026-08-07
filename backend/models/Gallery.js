import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, default: '' },
  museumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Museum', required: true },
  exhibitsCount: { type: Number, default: 0 }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
