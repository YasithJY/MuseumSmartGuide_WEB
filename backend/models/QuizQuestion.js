import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'true-false', 'image-based'], required: true },
  imageUrl: { type: String, default: '' }, // for image-based questions
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 10 },
  // Sinhala (si) and Tamil (ta) versions, shown to visitors in that language.
  // `options` are in the same order as the English ones, which are what
  // answers are scored against.
  translations: {
    si: { text: String, options: [String] },
    ta: { text: String, options: [String] }
  }
}, { timestamps: true });

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
export default QuizQuestion;
