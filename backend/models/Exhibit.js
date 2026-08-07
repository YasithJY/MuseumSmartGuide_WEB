import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const exhibitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  historicalInfo: { type: String, required: true },
  timeline: [timelineEventSchema],
  images: [{ type: String }],
  audioUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  qrCodeUrl: { type: String, default: '' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  galleryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery', required: true },
  museumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Museum', required: true },
  relatedArtifacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exhibit' }]
}, { timestamps: true });

const Exhibit = mongoose.model('Exhibit', exhibitSchema);
export default Exhibit;
