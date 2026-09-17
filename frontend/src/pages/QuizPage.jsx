import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LangContext } from '../context/LangContext';
import { mockQuizzes } from '../utils/mockData';
import { MdOutlineQuiz, MdOutlineNavigateNext, MdOutlineStars, MdArrowBack, MdExtension, MdEmojiEvents, MdSchool } from 'react-icons/md';

const API = '/api';

const QuizPage = () => {
  const { token, user, addPointsAndBadge } = useContext(AuthContext);
  const { t } = useContext(LangContext);
  const { exhibitId } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // Array of { questionId, selectedAnswer }
  const [selectedOpt, setSelectedOpt] = useState('');
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exhibitQuizError, setExhibitQuizError] = useState('');

  useEffect(() => {
    if (exhibitId) {
      // Fetch this exhibit's own quiz from the backend
      setLoading(true);
      setExhibitQuizError('');
      axios.get(`${API}/quizzes?exhibitId=${exhibitId}`)
        .then(({ data }) => {
          const found = data.data || [];
          setQuizzes(found);
          if (found.length > 0) {
            handleStartQuiz(found[0]);
          } else {
            setExhibitQuizError('No quiz is available for this exhibit yet.');
          }
        })
        .catch(() => setExhibitQuizError('Failed to load this exhibit\'s quiz.'))
        .finally(() => setLoading(false));
    } else {
      // Load local mock quizzes for the general Quiz Arena
      setQuizzes(mockQuizzes);
      setLoading(false);
    }
  }, [exhibitId]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setSelectedOpt('');
    setQuizResult(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOpt(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOpt) return;

    const currentQuestion = selectedQuiz.questions[currentQuestionIdx];
    const newAnswers = [...answers, { questionId: currentQuestion._id, selectedAnswer: selectedOpt }];
    setAnswers(newAnswers);
    setSelectedOpt('');

    if (currentQuestionIdx + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      submitQuizAnswers(newAnswers);
    }
  };

  const submitQuizAnswers = (finalAnswers) => {
    if (!token) {
      alert("Please log in to submit quiz answers and earn achievements!");
      setSelectedQuiz(null);
      return;
    }
    
    // Evaluate scores locally
    let correctCount = 0;
    const totalQuestions = selectedQuiz.questions.length;
    const results = [];

    selectedQuiz.questions.forEach(question => {
      const userAnswer = finalAnswers.find(a => a.questionId === question._id);
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
    const scorePoints = Math.round((correctCount / totalQuestions) * selectedQuiz.pointsReward);

    // Badges update
    const badgesEarned = [];
    const checkAndAwardBadge = (badgeId, title, icon) => {
      const alreadyEarned = user?.earnedBadges?.some(b => b.badgeId === badgeId);
      if (!alreadyEarned) {
        const badgeObj = { badgeId, title, icon, earnedAt: new Date() };
        badgesEarned.push(badgeObj);
        addPointsAndBadge(0, badgeObj);
      }
    };

    // Add points to profile
    addPointsAndBadge(scorePoints, null);

    // Award general badges
    checkAndAwardBadge('first_quiz', 'Quiz Explorer', 'MdEmojiEvents');
    if (correctCount === totalQuestions) {
      checkAndAwardBadge('perfect_score', 'Colombo Scholar', 'MdSchool');
    }

    setQuizResult({
      success: true,
      score: scorePoints,
      correctCount,
      totalQuestions,
      percent,
      results,
      badgesEarned
    });
  };

  const resetQuizPage = () => {
    setSelectedQuiz(null);
    setQuizResult(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (exhibitId && !selectedQuiz && !quizResult) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <div className="flex justify-center"><MdExtension className="text-5xl text-stone-400" /></div>
        <p className="text-sm text-stone-500 dark:text-stone-400 font-semibold">
          {exhibitQuizError || 'No quiz is available for this exhibit yet.'}
        </p>
        <Link to={`/exhibit/${exhibitId}`} className="inline-flex items-center gap-1 text-gold hover:underline text-sm">
          <MdArrowBack className="w-4 h-4" />
          <span>Back to Exhibit</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

      {!selectedQuiz && !exhibitId && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase text-accent font-bold tracking-widest font-heading block">
              Quiz Arena
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary dark:text-parchment uppercase">
              Historical Trivia & Quizzes
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
              Test your understanding of the Colombo Museum artifacts and early dynasties of Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map(quiz => (
              <div 
                key={quiz._id} 
                className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md rounded-2xl p-6 flex flex-col justify-between h-56 hover:border-gold transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-gold/15 text-primary text-[9px] uppercase font-bold px-2 py-0.5 rounded border border-gold/40">
                      {quiz.difficulty}
                    </span>
                    <span className="text-xs text-stone-400 font-semibold">{quiz.questions?.length || 0} Questions</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-primary dark:text-parchment leading-tight">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                    {quiz.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-700 pt-4">
                  <span className="text-xs font-mono font-bold text-gold">+{quiz.pointsReward} Points Max</span>
                  <button 
                    onClick={() => handleStartQuiz(quiz)}
                    className="bg-primary text-parchment font-bold px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors text-xs uppercase"
                  >
                    Start Trivia
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedQuiz && !quizResult && (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700 pb-4">
            <span className="text-xs font-mono text-stone-400 font-bold">
              Question {currentQuestionIdx + 1} of {selectedQuiz.questions.length}
            </span>
            <span className="text-xs uppercase text-gold font-bold font-heading">
              {selectedQuiz.title}
            </span>
          </div>

          <h3 className="font-heading font-bold text-lg text-primary dark:text-parchment leading-snug">
            {selectedQuiz.questions[currentQuestionIdx]?.text}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {selectedQuiz.questions[currentQuestionIdx]?.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(opt)}
                className={`w-full text-left p-4 rounded-xl border text-xs font-semibold transition-all ${selectedOpt === opt ? 'border-gold bg-gold/10 text-primary dark:text-parchment' : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNextQuestion}
              disabled={!selectedOpt}
              className={`flex items-center gap-1 font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider ${selectedOpt ? 'bg-gold text-primary hover:bg-yellow-600' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
            >
              <span>{currentQuestionIdx + 1 === selectedQuiz.questions.length ? 'Submit Quiz' : 'Next Question'}</span>
              <MdOutlineNavigateNext className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {quizResult && (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-2xl p-6 sm:p-8 space-y-8 text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-3xl mx-auto border border-gold/40">
              <MdEmojiEvents className="text-gold" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-primary dark:text-parchment uppercase">Quiz Completed!</h2>
            <p className="text-xs text-stone-500">Grading evaluation and reward breakdown</p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-stone-200 dark:border-stone-700 py-6 max-w-md mx-auto">
            <div>
              <span className="block font-heading font-extrabold text-2xl text-primary">{quizResult.correctCount}/{quizResult.totalQuestions}</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Correct</span>
            </div>
            <div>
              <span className="block font-heading font-extrabold text-2xl text-gold">+{quizResult.score}</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Points Earned</span>
            </div>
            <div>
              <span className="block font-heading font-extrabold text-2xl text-primary">{quizResult.percent}%</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Grade</span>
            </div>
          </div>

          {quizResult.badgesEarned && quizResult.badgesEarned.length > 0 && (
            <div className="space-y-3 bg-gold/10 border border-gold/40 p-4 rounded-xl max-w-md mx-auto">
              <span className="text-[10px] uppercase font-bold text-gold tracking-widest font-heading flex items-center justify-center gap-1">
                <MdOutlineStars className="w-4 h-4" />
                <span>New Badges Unlocked!</span>
              </span>
              <div className="flex items-center justify-center gap-2">
                {quizResult.badgesEarned.map((badge, idx) => (
                  <span key={idx} className="bg-white border border-gold/30 px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                    {badge.icon === 'MdEmojiEvents' ? <MdEmojiEvents className="text-gold" /> : badge.icon === 'MdSchool' ? <MdSchool className="text-gold" /> : badge.icon} {badge.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-left max-w-lg mx-auto space-y-4">
            <h4 className="font-heading font-bold text-sm text-primary dark:text-parchment uppercase">Question Review</h4>
            <div className="space-y-3">
              {quizResult.results.map((r, i) => (
                <div key={i} className="p-3 bg-stone-50 dark:bg-stone-700/50 rounded-lg border border-stone-200 dark:border-stone-600 text-xs">
                  <p className="font-bold text-stone-700 dark:text-stone-200">{i+1}. {r.text}</p>
                  <p className="mt-1 flex gap-2">
                    <span className="text-stone-500">Your Answer: <strong className={r.isCorrect ? 'text-green-600' : 'text-red-600'}>{r.userAnswer}</strong></span>
                    {!r.isCorrect && <span className="text-stone-500">Correct: <strong className="text-green-600">{r.correctAnswer}</strong></span>}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            {exhibitId ? (
              <Link to={`/exhibit/${exhibitId}`} className="inline-block bg-primary text-parchment font-bold px-6 py-2.5 rounded-lg hover:bg-stone-850 transition-colors text-xs uppercase">
                Back to Exhibit
              </Link>
            ) : (
              <button onClick={resetQuizPage} className="bg-primary text-parchment font-bold px-6 py-2.5 rounded-lg hover:bg-stone-850 transition-colors text-xs uppercase">
                Continue to Arena
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default QuizPage;
