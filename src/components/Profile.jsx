import React, { useState, useEffect } from 'react';
import { getLearningProgress, getAchievements } from '../utils/api';

export default function Profile({ user, projects, onClose }) {
  const [learningProgressPercent, setLearningProgressPercent] = useState(0);
  const [achievementsList, setAchievementsList] = useState([]);

  // Статистика из проектов
  const totalProjects = projects?.length || 0;
  const totalTasks = projects?.reduce((acc, p) => acc + (p.tasks?.length || 0), 0) || 0;
  const completedSprints = projects?.filter(p => p.activeSprint === null && p.methodology !== 'Kanban').length || 0;
  const quizPassedCount = projects?.filter(p => p.quizPassed).length || 0;

  // Загрузка прогресса обучения из БД
  useEffect(() => {
    const loadData = async () => {
      try {
        const [progress, achievements] = await Promise.all([
          getLearningProgress(),
          getAchievements()
        ]);
        const completed = progress.filter(p => p.completed).length;
        setLearningProgressPercent(Math.floor((completed / 4) * 100));
        setAchievementsList(achievements);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      }
    };
    loadData();
  }, []);

  const hasAchievement = (key) => achievementsList.includes(key);

  const achievements = [
    { id: 1, name: '🏅 Знаток Agile', unlocked: quizPassedCount > 0, desc: 'Пройти квиз хотя бы в одном проекте' },
    { id: 2, name: '🚀 Спринт-мастер', unlocked: completedSprints >= 3, desc: 'Завершить 3 спринта' },
    { id: 3, name: '📋 WIP-гуру', unlocked: totalProjects >= 2, desc: 'Создать 2 проекта с WIP-лимитами' },
    { id: 4, name: '🎯 Активный', unlocked: totalProjects >= 5, desc: 'Создать 5 проектов' },
    { id: 5, name: '🎓 Agile-выпускник', unlocked: hasAchievement('certificate_earned'), desc: 'Полностью пройти обучение Agile' },
    { id: 6, name: '📘 Знаток основ Agile', unlocked: hasAchievement('quiz_basics_passed'), desc: 'Пройди квиз "Основы Agile"' },
    { id: 7, name: '🏆 Мастер Agile', unlocked: hasAchievement('quiz_advanced_passed'), desc: 'Пройди квиз "Продвинутый Agile"' },
    { id: 8, name: '🎓 Agile-эксперт', unlocked: hasAchievement('quiz_expert_passed'), desc: 'Пройди квиз "Agile-эксперт"' },
    { id: 9, name: '👑 Абсолютный чемпион', unlocked: hasAchievement('all_quizzes_completed'), desc: 'Пройди все глобальные квизы' }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="modal-title">👤 Личный кабинет</h2>
          <button onClick={onClose} style={{ background: '#ef4444', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px' }}>👤</div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '8px 0 4px' }}>{user?.name || 'Пользователь'}</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>С {new Date().toLocaleDateString()}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', background: '#f3f4f6', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalProjects}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Проектов</div>
          </div>
          <div style={{ textAlign: 'center', background: '#f3f4f6', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalTasks}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Задач</div>
          </div>
          <div style={{ textAlign: 'center', background: '#f3f4f6', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{completedSprints}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Спринтов</div>
          </div>
          <div style={{ textAlign: 'center', background: '#f3f4f6', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{quizPassedCount}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Квизов пройдено</div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>📚 Прогресс обучения</span>
            <span style={{ fontSize: '14px', color: '#4f46e5' }}>{learningProgressPercent}%</span>
          </div>
          <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${learningProgressPercent}%`, background: '#4f46e5', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            🏆 Достижения ({unlockedCount}/{achievements.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {achievements.map(a => (
              <div 
                key={a.id} 
                className={`achievement-item ${a.unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '10px', 
                  borderRadius: '12px',
                  background: a.unlocked ? '#ecfdf5' : '#f3f4f6',
                  opacity: a.unlocked ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '28px' }}>{a.name.split(' ')[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{a.name}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{a.desc}</div>
                </div>
                {a.unlocked && <div style={{ fontSize: '20px', color: '#10b981' }}>✓</div>}
              </div>
            ))}
          </div>
        </div>

        <button onClick={onClose} className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>Закрыть</button>
      </div>
    </div>
  );
}