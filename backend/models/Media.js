import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'audio', 'video', 'pdf'], required: true },
  size: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);
export default Media;
