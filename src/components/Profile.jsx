import React from 'react';

export default function Profile({ user, projects, onClose }) {
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const completedSprints = projects.filter(p => p.activeSprint === null && p.methodology !== 'Kanban').length;
  const quizPassedCount = projects.filter(p => p.quizPassed).length;
  
  // Прогресс обучения (считываем актуальные данные из localStorage)
  // Прогресс обучения (считываем актуальные данные из localStorage)
  const learningProgressSaved = localStorage.getItem('learning_progress');
  const learningModules = learningProgressSaved ? JSON.parse(learningProgressSaved) : [];
  const completedModules = learningModules.filter(m => m.completed).length;
  const learningProgressPercent = learningModules.length ? Math.floor((completedModules / learningModules.length) * 100) : 0;
  
const achievements = [
  { id: 1, name: '🏅 Знаток Agile', unlocked: quizPassedCount > 0, desc: 'Пройти квиз хотя бы в одном проекте' },
  { id: 2, name: '🚀 Спринт-мастер', unlocked: completedSprints >= 3, desc: 'Завершить 3 спринта' },
  { id: 3, name: '📋 WIP-гуру', unlocked: totalProjects >= 2, desc: 'Создать 2 проекта с WIP-лимитами' },
  { id: 4, name: '🎯 Активный', unlocked: totalProjects >= 5, desc: 'Создать 5 проектов' },
  { id: 5, name: '🎓 Agile-выпускник', unlocked: localStorage.getItem('certificate_earned') === 'true', desc: 'Полностью пройти обучение Agile' },
  { id: 6, name: '⭐ Абсолютный чемпион', unlocked: localStorage.getItem('all_quizzes_completed') === 'true', desc: 'Пройди все квизы на странице квизов' }
];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '500px', 
          width: '90%', 
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '20px'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* КРЕСТИК В ПРАВОМ ВЕРХНЕМ УГЛУ */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '0',
            float: 'right',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}
          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
          onMouseLeave={(e) => e.target.style.background = '#ef4444'}
        >
          ✕
        </button>
        
        <div style={{ clear: 'both' }}>
          <div className="profile-user-info">
            <div className="profile-avatar">👤</div>
            <h3 className="profile-user-name">{user.name}</h3>
            
          </div>
          
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-number">{totalProjects}</div>
              <div className="profile-stat-label">Проектов</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-number">{totalTasks}</div>
              <div className="profile-stat-label">Задач</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-number">{completedSprints}</div>
              <div className="profile-stat-label">Спринтов</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-number">{quizPassedCount}</div>
              <div className="profile-stat-label">Квизов пройдено</div>
            </div>
          </div>
          
          <div className="profile-progress-section">
            <div className="profile-progress-header">
                <span className="profile-progress-label">📚 Прогресс обучения</span>
                <span className="profile-progress-percent">{learningProgressPercent}%</span>
            </div>
            <div className="profile-progress-bar">
                <div className="profile-progress-fill" style={{ width: `${learningProgressPercent}%` }}></div>
            </div>
          </div>
          
          <div className="profile-achievements">
            <h3 className="profile-achievements-title">🏆 Достижения ({unlockedCount}/{achievements.length})</h3>
            <div>
              {achievements.map(a => (
                <div key={a.id} className={`profile-achievement-item ${a.unlocked ? 'profile-achievement-unlocked' : 'profile-achievement-locked'}`}>
                  <div className="profile-achievement-icon">{a.name.split(' ')[0]}</div>
                  <div className="profile-achievement-info">
                    <div className="profile-achievement-name">{a.name}</div>
                    <div className="profile-achievement-desc">{a.desc}</div>
                  </div>
                  {a.unlocked && <div className="profile-achievement-check">✓</div>}
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={onClose} className="btn-primary profile-close-btn" style={{ marginTop: '16px', width: '100%' }}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}