import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'true-false', 'image-based'], required: true },
  imageUrl: { type: String, default: '' }, // for image-based questions
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 10 }
}, { timestamps: true });

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
export default QuizQuestion;
