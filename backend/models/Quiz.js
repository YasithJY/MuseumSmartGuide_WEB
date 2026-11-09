import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  pointsReward: { type: Number, default: 50 },
  coverImage: { type: String, default: '' },
  museumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Museum' },
  galleryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' },
  exhibitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exhibit', default: null },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' }],
  // Sinhala (si) and Tamil (ta) title and description
  translations: {
    si: { title: String, description: String },
    ta: { title: String, description: String }
  }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
