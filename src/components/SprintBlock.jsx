import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function SprintBlock({ project, onCompleteSprint }) {
  const [sprint, setSprint] = useState(project.activeSprint || null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [weeks, setWeeks] = useState(2);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

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
      goal: goal.trim(),
      weeks,
      endDate: endDate.toISOString()
    };
    setSprint(newSprint);
    setShowForm(false);
    setName('');
    setGoal('');
    if (onCompleteSprint) onCompleteSprint({ ...project, activeSprint: newSprint });
  };

  const completeSprint = () => {
    setSprint(null);
    if (onCompleteSprint) {
      onCompleteSprint({ ...project, activeSprint: null });
    }
    setShowConfirm(false);
  };

  if (project.methodology === 'Kanban') return null;

  if (!sprint && !showForm) {
    return (
      <div className="sprint-empty">
        <p className="sprint-empty-text">Нет активного спринта</p>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Создать спринт</button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="sprint-form">
        <h3 className="sprint-form-title">📅 Создать спринт</h3>
        <input type="text" placeholder="Название спринта" className="sprint-input" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Цель спринта" className="sprint-input" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <select className="sprint-select" value={weeks} onChange={(e) => setWeeks(parseInt(e.target.value))}>
          <option value="1">1 неделя</option><option value="2">2 недели</option><option value="3">3 недели</option><option value="4">4 недели</option>
        </select>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={createSprint}>Создать</button>
          <button className="btn-secondary" onClick={() => setShowForm(false)}>Отмена</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sprint-active">
        <div className="sprint-active-content">
          <div>
            <h3 className="sprint-name">🏃 {sprint.name}</h3>
            {sprint.goal && <p className="sprint-goal" style={{ fontSize: '12px', color: '#4f46e5', marginTop: '4px' }}>🎯 {sprint.goal}</p>}
            <p className="sprint-timer">{sprint.weeks} нед.</p>
          </div>
          {timeLeft && <div className="sprint-timer">{timeLeft.days}д {timeLeft.hours}ч {timeLeft.minutes}м</div>}
          <button className="btn-complete-sprint" 
          onClick={() => setShowConfirm(true)} 
          title="✅ Завершить спринт? Незавершённые задачи останутся на доске">
            ✅ Завершить спринт
          </button>
        </div>
      </div>

      {/* Модалка подтверждения */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Завершить спринт?"
        message="Незавершённые задачи останутся на доске."
        buttons={[
          { text: 'Да', onClick: completeSprint, variant: 'danger' },
          { text: 'Отмена', onClick: () => setShowConfirm(false), variant: 'default' }
        ]}
      />
   
    </>
  );
}