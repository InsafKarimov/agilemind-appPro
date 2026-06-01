import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { getLearningProgress, saveLearningProgress, addAchievement } from '../utils/api';

const modules = [
  { id: 1, title: '📘 Что такое Agile?', content: 'Agile — это подход к управлению проектами, основанный на итеративной разработке, гибкости и постоянной обратной связи. Манифест Agile был подписан в 2001 году 17 экспертами.' },
  { id: 2, title: '🏃 Scrum: роли, события, артефакты', content: 'Scrum — фреймворк с фиксированными спринтами (1-4 недели).' },
  { id: 3, title: '📋 Kanban: визуализация потока', content: 'Kanban фокусируется на ограничении незавершённой работы (WIP-лимиты).' },
  { id: 4, title: '🔄 Scrumban: гибридный подход', content: 'Scrumban сочетает ритм спринтов Scrum с WIP-лимитами Kanban.' }
];

export default function LearningMaterials({ onClose, onCertificateEarned }) {
  const [learningProgress, setLearningProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const [certificateGiven, setCertificateGiven] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLearningProgress();
        const progress = modules.map(m => ({
          ...m,
          completed: data.find(p => p.module_id === m.id)?.completed || false
        }));
        setLearningProgress(progress);
        if (progress.every(m => m.completed)) setCertificateGiven(true);
      } catch (err) {
        setLearningProgress(modules.map(m => ({ ...m, completed: false })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markCompleted = async (id) => {
    const newProgress = learningProgress.map(m =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    setLearningProgress(newProgress);
    await saveLearningProgress(newProgress.map(m => ({ module_id: m.id, completed: m.completed })));
    
    const allCompleted = newProgress.every(m => m.completed);
    if (allCompleted) {
      setShowConfetti(true);
      setConfettiOpacity(1);
      setTimeout(() => {
        let opacity = 1;
        const fadeInterval = setInterval(() => {
          opacity -= 0.02;
          setConfettiOpacity(opacity);
          if (opacity <= 0) {
            clearInterval(fadeInterval);
            setShowConfetti(false);
          }
        }, 50);
      }, 5000);
      setShowCertificate(true);
      if (!certificateGiven) {
        setCertificateGiven(true);
        await addAchievement('certificate_earned');
        if (onCertificateEarned) onCertificateEarned();
      }
    } else {
      setShowCertificate(false);
    }
  };

  const completedCount = learningProgress.filter(m => m.completed).length;
  const progressPercent = Math.floor((completedCount / modules.length) * 100);

  if (loading) return <div className="modal-overlay" onClick={onClose}><div className="modal-content">Загрузка...</div></div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          pointerEvents: 'none',
          opacity: confettiOpacity,
          transition: 'opacity 0.05s linear'
        }}>
          <Confetti
            recycle={true}
            numberOfPieces={350}
            gravity={0.15}
            wind={0.02}
            colors={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4']}
            tweenDuration={5000}
          />
        </div>
      )}
      <div className="modal-content learning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="learning-header">
          <h2 className="modal-title">📚 Обучение Agile</h2>
          <button onClick={onClose} className="learning-close-btn">✕</button>
        </div>

        <div className="learning-progress">
          <div className="learning-progress-header">
            <span>📊 Прогресс обучения</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {learningProgress.map(module => (
          <div key={module.id} className={`learning-module ${module.completed ? 'module-completed' : 'module-default'}`}>
            <div className="module-header">
              <h3>{module.title}</h3>
              <button onClick={() => markCompleted(module.id)} className={`module-btn ${module.completed ? 'btn-completed' : 'btn-mark'}`}>
                {module.completed ? '✅ Пройдено' : '📖 Отметить пройденным'}
              </button>
            </div>
            <p className="module-content">{module.content}</p>
            <div className="video-funny-permanent">
              <div className="video-funny-permanent-icon">🎥💨</div>
              <div className="video-funny-permanent-text">
                <p className="funny-title">📡 Видео временно недоступно</p>
                <p className="funny-subtitle">Но ты всё равно красавчик, что учишься!</p>
                <div className="funny-loader"></div>
                <p className="funny-hint">Рекомендуем поискать тему на VK Video или Rutube</p>
              </div>
            </div>
            <div className="video-note">📖 Изучи теорию выше и отметь модуль пройденным</div>
          </div>
        ))}

        {showCertificate && (
          <div className="certificate-box certificate-animation">
            <div className="certificate-icon">🎓✨</div>
            <h3>Поздравляем!</h3>
            <p>Вы полностью изучили Agile-методологии.</p>
            <p><strong>Выдан сертификат "Agile-выпускник"!</strong></p>
            <p>Новое достижение появилось в личном кабинете 🏆</p>
          </div>
        )}

        <button onClick={onClose} className="btn-primary learning-close-bottom">Закрыть</button>
      </div>
    </div>
  );
}