import Quiz from '../models/Quiz.js';
import QuizQuestion from '../models/QuizQuestion.js';
import User from '../models/User.js';

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).populate('questions');
    res.json({ success: true, count: quizzes.length, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (quiz) {
      res.json({ success: true, data: quiz });
    } else {
      res.status(404).json({ success: false, message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { title, description, difficulty, pointsReward, museumId, galleryId, questionsData } = req.body;
    
    // Create the questions first
    const createdQuestions = await QuizQuestion.insertMany(questionsData);
    const questionIds = createdQuestions.map(q => q._id);

    const quiz = await Quiz.create({
      title,
      description,
      difficulty,
      pointsReward,
      museumId,
      galleryId,
      questions: questionIds
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  const { answers } = req.body; // Array of { questionId, selectedAnswer }
  const userId = req.user._id;

  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const results = [];

    quiz.questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const isCorrect = userAnswer && userAnswer.selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      
      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionId: question._id,
        text: question.text,
        userAnswer: userAnswer ? userAnswer.selectedAnswer : '',
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    });

    const percent = Math.round((correctCount / totalQuestions) * 100);
    const scorePoints = Math.round((correctCount / totalQuestions) * quiz.pointsReward);

    // Update user points & check badges
    const user = await User.findById(userId);
    let badgesEarned = [];

    if (user) {
      user.points += scorePoints;

      // Badge checks
      const earnBadge = (badgeId, title, icon) => {
        const alreadyEarned = user.earnedBadges.some(b => b.badgeId === badgeId);
        if (!alreadyEarned) {
          const badgeObj = { badgeId, title, icon, earnedAt: new Date() };
          user.earnedBadges.push(badgeObj);
          badgesEarned.push(badgeObj);
        }
      };

      // 1. First quiz badge
      earnBadge('first_quiz', 'Quiz Explorer', '🏆');

      // 2. Perfect score badge
      if (correctCount === totalQuestions) {
        earnBadge('perfect_score', 'Colombo scholar', '🎓');
      }

      // 3. Score-based badges
      if (user.points >= 100) {
        earnBadge('points_100', 'Bronze Historian', '🎖️');
      }
      if (user.points >= 500) {
        earnBadge('points_500', 'Golden Antiquarian', '👑');
      }

      await user.save();
    }

    res.json({
      success: true,
      score: scorePoints,
      correctCount,
      totalQuestions,
      percent,
      results,
      badgesEarned,
      totalPoints: user ? user.points : 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
      // Optional: Delete related questions
      await QuizQuestion.deleteMany({ _id: { $in: quiz.questions } });
      await Quiz.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Quiz and questions deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
