import mongoose from 'mongoose';

const visitHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exhibitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exhibit', required: true },
  visitedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const VisitHistory = mongoose.model('VisitHistory', visitHistorySchema);
export default VisitHistory;
