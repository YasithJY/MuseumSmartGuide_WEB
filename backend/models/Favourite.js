import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exhibitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exhibit', required: true },
  savedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Make userId + exhibitId pair unique to prevent duplicates
favouriteSchema.index({ userId: 1, exhibitId: 1 }, { unique: true });

const Favourite = mongoose.model('Favourite', favouriteSchema);
export default Favourite;
