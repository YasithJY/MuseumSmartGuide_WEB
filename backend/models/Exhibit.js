import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

// Translated timeline events (year is shared, title/description are translated)
const translatedTimelineEventSchema = new mongoose.Schema({
  year: { type: String },
  title: { type: String },
  description: { type: String }
});

// Language-specific content for an exhibit
const exhibitTranslationSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  historicalInfo: { type: String, default: '' },
  timeline: [translatedTimelineEventSchema]
}, { _id: false });

const exhibitSchema = new mongoose.Schema({
  // Default language: English
  title: { type: String, required: true },
  description: { type: String, required: true },
  historicalInfo: { type: String, required: true },
  timeline: [timelineEventSchema],
  images: [{ type: String }],
  audioUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  arModelUrl: { type: String, default: '' },
  arModelUrlIOS: { type: String, default: '' },
  qrCodeUrl: { type: String, default: '' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  galleryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery', required: true },
  museumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Museum', required: true },
  relatedArtifacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exhibit' }],
  // Multilingual translations: Sinhala (si) and Tamil (ta)
  translations: {
    si: { type: exhibitTranslationSchema, default: () => ({}) },
    ta: { type: exhibitTranslationSchema, default: () => ({}) }
  }
}, { timestamps: true });

const Exhibit = mongoose.model('Exhibit', exhibitSchema);
export default Exhibit;
