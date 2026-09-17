import Quiz from '../models/Quiz.js';
import QuizQuestion from '../models/QuizQuestion.js';
import User from '../models/User.js';

export const getQuizzes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.exhibitId) filter.exhibitId = req.query.exhibitId;
    const quizzes = await Quiz.find(filter).populate('questions');
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
    const { title, description, difficulty, pointsReward, coverImage, museumId, galleryId, questionsData } = req.body;

    // Create questions first
    const createdQuestions = questionsData?.length
      ? await QuizQuestion.insertMany(questionsData)
      : [];
    const questionIds = createdQuestions.map(q => q._id);

    const quiz = await Quiz.create({
      title,
      description,
      difficulty,
      pointsReward,
      coverImage: coverImage || '',
      museumId: museumId || null,
      galleryId: galleryId || null,
      questions: questionIds
    });

    const populated = await Quiz.findById(quiz._id).populate('questions');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { title, description, difficulty, pointsReward, coverImage, museumId, galleryId, questionsData } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Replace questions: delete old, insert new
    if (Array.isArray(questionsData)) {
      await QuizQuestion.deleteMany({ _id: { $in: quiz.questions } });
      const createdQuestions = questionsData.length
        ? await QuizQuestion.insertMany(questionsData)
        : [];
      quiz.questions = createdQuestions.map(q => q._id);
    }

    quiz.title = title ?? quiz.title;
    quiz.description = description ?? quiz.description;
    quiz.difficulty = difficulty ?? quiz.difficulty;
    quiz.pointsReward = pointsReward ?? quiz.pointsReward;
    quiz.coverImage = coverImage ?? quiz.coverImage;
    quiz.museumId = museumId || null;
    quiz.galleryId = galleryId || null;

    await quiz.save();
    const populated = await Quiz.findById(quiz._id).populate('questions');
    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
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

export const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const userId = req.user._id;

  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const results = [];

    quiz.questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const isCorrect = userAnswer && userAnswer.selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
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

    const user = await User.findById(userId);
    let badgesEarned = [];

    if (user) {
      user.points += scorePoints;
      const earnBadge = (badgeId, title, icon) => {
        if (!user.earnedBadges.some(b => b.badgeId === badgeId)) {
          const badgeObj = { badgeId, title, icon, earnedAt: new Date() };
          user.earnedBadges.push(badgeObj);
          badgesEarned.push(badgeObj);
        }
      };
      earnBadge('first_quiz', 'Quiz Explorer', '🏆');
      if (correctCount === totalQuestions) earnBadge('perfect_score', 'Colombo Scholar', '🎓');
      if (user.points >= 100) earnBadge('points_100', 'Bronze Historian', '🎖️');
      if (user.points >= 500) earnBadge('points_500', 'Golden Antiquarian', '👑');
      await user.save();
    }

    res.json({ success: true, score: scorePoints, correctCount, totalQuestions, percent, results, badgesEarned, totalPoints: user ? user.points : 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
