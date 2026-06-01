import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { getAchievements, addAchievement } from '../utils/api';

const QUIZZES = [
  {
    id: 'agile_basics',
    title: '📘 Основы Agile',
    description: 'Проверь знание базовых принципов Agile и Манифеста.',
    questions: [
      { text: 'Что такое WIP-лимит?', options: ['Максимум задач в работе', 'Время спринта', 'Количество сотрудников'], correct: 0, hint: 'WIP расшифровывается как Work In Progress — незавершённая работа.' },
      { text: 'Как контекстные подсказки помогают бороться с «Agile-театром»?', options: ['Увеличивают число встреч', 'Объясняют последствия действий', 'Отключают стендапы'], correct: 1, hint: 'Объясняют, почему нельзя превышать лимит.' },
      { text: 'Что из перечисленного является признаком «Agile-театра»?', options: ['Обсуждение реальных проблем', 'Формальные ретроспективы без изменений', 'Гибкое планирование'], correct: 1, hint: 'Ретроспективы без изменений — это театр.' }
    ],
    passingScore: 2,
    achievement: 'quiz_basics_passed'
  },
  {
    id: 'agile_advanced',
    title: '🏆 Продвинутый Agile',
    description: 'Проверь знание гибридных методологий и продвинутых концепций.',
    questions: [
      { text: 'Почему гибридный подход Scrumban эффективнее?', options: ['Убирает все встречи', 'Сочетает спринты с WIP', 'Увеличивает документацию'], correct: 1, hint: 'Scrumban = Scrum + Kanban.' },
      { text: 'Что такое story points?', options: ['Оценка сложности задачи', 'Время в часах', 'Количество строк кода'], correct: 0, hint: 'Относительная оценка сложности.' },
      { text: 'Как часто проводится ретроспектива в Scrum?', options: ['После каждого спринта', 'Раз в месяц', 'В конце проекта'], correct: 0, hint: 'После каждого спринта.' }
    ],
    passingScore: 2,
    achievement: 'quiz_advanced_passed'
  },
  {
    id: 'agile_expert',
    title: '🎓 Agile-эксперт',
    description: 'Финальный квиз для настоящих экспертов!',
    questions: [
      { text: 'Что означает термин "инкремент" в Scrum?', options: ['Работающий продукт после спринта', 'План на следующий спринт', 'Список задач'], correct: 0, hint: 'Работающая версия продукта.' },
      { text: 'Что делает Scrum Master?', options: ['Управляет бюджетом', 'Убирает препятствия и налаживает процессы', 'Пишет код'], correct: 1, hint: 'Убирает препятствия.' },
      { text: 'Какой фреймворк использует WIP-лимиты?', options: ['Scrum', 'Kanban', 'Waterfall'], correct: 1, hint: 'Kanban.' },
      { text: 'Что такое бэклог?', options: ['Список приоритетных задач', 'Отчёт о спринте', 'Ежедневная встреча'], correct: 0, hint: 'Список задач.' }
    ],
    passingScore: 3,
    achievement: 'quiz_expert_passed'
  }
];

export default function QuizzesPage({ onBack }) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState({});
  const [achievementsList, setAchievementsList] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загрузка достижений из БД
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAchievements();
        setAchievementsList(data);
      } catch (err) {
        console.error('Ошибка загрузки достижений:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hasAchievement = (key) => achievementsList.includes(key);
  
  const quizStatus = {};
  QUIZZES.forEach(q => {
    quizStatus[q.id] = hasAchievement(q.achievement);
  });

  const allCompleted = Object.values(quizStatus).every(v => v === true);
  const allCompletedBefore = hasAchievement('all_quizzes_completed');

  useEffect(() => {
    if (allCompleted && !allCompletedBefore) {
      setShowConfetti(true);
      addAchievement('all_quizzes_completed');
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [allCompleted, allCompletedBefore]);

  const toggleHint = (idx) => {
    setShowHint(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const submitQuiz = async () => {
    let correct = 0;
    selectedQuiz.questions.forEach((q, i) => {
      if (parseInt(answers[i]) === q.correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    const passed = correct >= selectedQuiz.passingScore;
    if (passed) {
      await addAchievement(selectedQuiz.achievement);
      setAchievementsList(prev => [...prev, selectedQuiz.achievement]);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setShowHint({});
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px' }}>Загрузка...</div>;
  }

  if (selectedQuiz && !submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '24px' }}>
          <button onClick={resetQuiz} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginBottom: '16px' }}>← К списку квизов</button>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{selectedQuiz.title}</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>Для прохождения нужно {selectedQuiz.passingScore} правильных ответа из {selectedQuiz.questions.length}</p>
          
          {selectedQuiz.questions.map((q, idx) => {
            const selectedAnswer = answers[idx];
            const isCorrect = selectedAnswer !== undefined && selectedAnswer === q.correct;
            const isWrong = selectedAnswer !== undefined && selectedAnswer !== q.correct;
            
            return (
              <div key={idx} style={{ 
                marginBottom: '16px', 
                padding: '16px', 
                background: isWrong ? '#fee2e2' : isCorrect ? '#d1fae5' : '#f9fafb', 
                borderRadius: '12px',
                borderLeft: isWrong ? '4px solid #ef4444' : isCorrect ? '4px solid #10b981' : 'none'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{idx+1}. {q.text}</p>
                {q.options.map((opt, oidx) => (
                  <label key={oidx} style={{ display: 'block', marginLeft: '12px', marginBottom: '8px', cursor: 'pointer', padding: '4px 0' }}>
                    <input 
                      type="radio" 
                      name={`q${idx}`} 
                      value={oidx} 
                      onChange={(e) => setAnswers({...answers, [idx]: parseInt(e.target.value)})}
                      checked={answers[idx] === oidx}
                      style={{ marginRight: '8px' }} 
                    />
                    <span style={{ 
                      color: answers[idx] === oidx && oidx === q.correct ? '#10b981' : 
                             answers[idx] === oidx && oidx !== q.correct ? '#dc2626' : '#374151',
                      fontWeight: answers[idx] === oidx && oidx === q.correct ? 'bold' : 'normal'
                    }}>
                      {opt}
                      {answers[idx] === oidx && oidx === q.correct && ' ✓'}
                      {answers[idx] === oidx && oidx !== q.correct && ' ✗'}
                    </span>
                  </label>
                ))}
                
                {isWrong && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#fef3c7', borderRadius: '8px' }}>
                    <p style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '4px' }}>📖 Подсказка:</p>
                    <p style={{ fontSize: '13px', color: '#78350f' }}>{q.hint}</p>
                    <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>✅ Правильный ответ: {q.options[q.correct]}</p>
                  </div>
                )}
                
                {!isWrong && !isCorrect && (
                  <button 
                    onClick={() => toggleHint(idx)}
                    style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
                  >
                    {showHint[idx] ? 'Скрыть подсказку' : '💡 Показать подсказку'}
                  </button>
                )}
                
                {showHint[idx] && !isWrong && !isCorrect && (
                  <div style={{ marginTop: '8px', padding: '8px 12px', background: '#eff6ff', borderRadius: '8px', fontSize: '12px', color: '#1e40af' }}>
                    {q.hint}
                  </div>
                )}
              </div>
            );
          })}
          
          <button 
            onClick={submitQuiz} 
            style={{ width: '100%', padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', marginTop: '16px' }}
          >
            Завершить квиз
          </button>
        </div>
      </div>
    );
  }

  if (selectedQuiz && submitted) {
    const passed = score >= selectedQuiz.passingScore;
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{passed ? '🏆' : '📚'}</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{passed ? 'Поздравляем!' : 'Попробуйте ещё раз'}</h2>
          <p style={{ margin: '16px 0' }}>Правильных ответов: {score} из {selectedQuiz.questions.length}</p>
          {!passed && <p style={{ fontSize: '13px', color: '#6b7280' }}>Используйте подсказки, чтобы узнать правильные ответы!</p>}
          {passed && <p style={{ background: '#fef3c7', padding: '12px', borderRadius: '12px' }}>🏅 Получено достижение "{selectedQuiz.title}"!</p>}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={resetQuiz} style={{ flex: 1, padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Закрыть</button>
            <button onClick={() => { resetQuiz(); setSelectedQuiz(null); }} style={{ flex: 1, padding: '12px', background: '#e5e7eb', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>К списку</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px' }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.15} />}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginBottom: '16px' }}>← На главную</button>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>🏅 Квизы по Agile</h1>
          <p>Пройди все квизы и получи достижение «Абсолютный чемпион»!</p>
          {allCompleted && <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '16px', padding: '16px', marginTop: '20px', fontWeight: 'bold' }}>👑 Все квизы пройдены! Ты чемпион! 👑</div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {QUIZZES.map(quiz => {
            const isCompleted = quizStatus[quiz.id];
            return (
              <div key={quiz.id} style={{ background: isCompleted ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : 'white', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{isCompleted ? '✅' : '📝'}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{quiz.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>{quiz.description}</p>
                <button onClick={() => setSelectedQuiz(quiz)} style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                  {isCompleted ? 'Пройти ещё раз' : 'Начать квиз'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}