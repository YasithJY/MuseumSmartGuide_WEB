import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'true-false'], required: true },
  options: [{ type: String }], // Optional for true/false
  correctAnswer: { type: String, required: true }, // The string matching correct option or 'True'/'False'
  points: { type: Number, default: 10 }
}, { timestamps: true });

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
export default QuizQuestion;
