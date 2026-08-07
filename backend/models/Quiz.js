import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  pointsReward: { type: Number, default: 50 },
  museumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Museum' },
  galleryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' }]
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
