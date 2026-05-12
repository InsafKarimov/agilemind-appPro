import React, { useState, useEffect } from 'react';

export default function SprintBlock({ project, onCompleteSprint }) {
  const [sprint, setSprint] = useState(project.activeSprint || null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [weeks, setWeeks] = useState(2);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showRetro, setShowRetro] = useState(false);
  const [retroFeedback, setRetroFeedback] = useState({ good: '', bad: '', improve: '' });

  useEffect(() => {
    if (sprint?.endDate) {
      const timer = setInterval(() => {
        const end = new Date(sprint.endDate);
        const diff = end - new Date();
        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0 });
          clearInterval(timer);
        } else {
          setTimeLeft({
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000)
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sprint]);

  const createSprint = () => {
    if (!name.trim()) return;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + weeks * 7);
    const newSprint = {
      id: Date.now(),
      name: name.trim(),
      weeks,
      endDate: endDate.toISOString()
    };
    setSprint(newSprint);
    setShowForm(false);
    setName('');
    if (onCompleteSprint) onCompleteSprint({ ...project, activeSprint: newSprint });
  };
const completeSprint = () => {
  if (window.confirm('Завершить спринт?')) {
    setSprint(null);
    if (onCompleteSprint) {
      onCompleteSprint({ ...project, activeSprint: null });
    }
  }
};

  if (project.methodology === 'Kanban') return null;

  if (!sprint && !showForm) {
    return (
      <div className="sprint-empty">
        <p className="sprint-empty-text">Нет активного спринта</p>
        <button className="btn-primary" onClick={() => setShowForm(true)} title="📅 Создать спринт на 1-4 недели. Спринт даёт ритм и фокус команде.">
          + Создать спринт
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="sprint-form">
        <h3 className="sprint-form-title">📅 Создать спринт</h3>
        <input
          type="text"
          placeholder="Название спринта"
          className="sprint-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="sprint-select"
          value={weeks}
          onChange={(e) => setWeeks(parseInt(e.target.value))}
        >
          <option value="1">1 неделя</option>
          <option value="2">2 недели</option>
          <option value="3">3 недели</option>
          <option value="4">4 недели</option>
        </select>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={createSprint}>Создать</button>
          <button className="btn-secondary" onClick={() => setShowForm(false)}>Отмена</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sprint-active">
      <div className="sprint-active-content">
        <div>
          <h3 className="sprint-name">🏃 {sprint.name}</h3>
          <p className="sprint-timer">{sprint.weeks} нед.</p>
        </div>
        {timeLeft && (
          <div className="sprint-timer">
            {timeLeft.days}д {timeLeft.hours}ч {timeLeft.minutes}м
          </div>
        )}
        <button className="btn-complete-sprint" onClick={completeSprint} title="✅ Завершить текущий спринт. Незавершённые задачи останутся на доске.">
          ✅ Завершить спринт
        </button>
        
      </div>
      
    </div>

  );
}