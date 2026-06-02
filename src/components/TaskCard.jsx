import React from 'react';

export default function TaskCard({ task, onDelete, onEdit, isDraggable = true, onMove }) {
  const priorityColors = {
    Low: 'border-l-green-500',
    Medium: 'border-l-yellow-500',
    High: 'border-l-red-500'
  };

  const statusOrder = { todo: 0, inprogress: 1, done: 2 };
  const currentIndex = statusOrder[task.status];
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < 2;

  const moveLeft = () => {
    const newStatus = currentIndex === 1 ? 'todo' : 'inprogress';
    onMove(task.id, newStatus);
  };

  const moveRight = () => {
    const newStatus = currentIndex === 0 ? 'inprogress' : 'done';
    onMove(task.id, newStatus);
  };

  return (
    <div
      className={`task-card ${priorityColors[task.priority] || 'border-l-indigo-500'}`}
      draggable={isDraggable}
      onDragStart={(e) => {
        if (isDraggable) {
          e.dataTransfer.setData('taskId', task.id);
          e.target.style.opacity = '0.5';
        }
      }}
      onDragEnd={(e) => e.target.style.opacity = '1'}
    >
      <div className="task-card-content">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onEdit(task)}>
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
        </div>
        <button className="task-delete" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>✕</button>
      </div>
      
      {/* Кнопки для перемещения (на телефоне вместо drag-and-drop) */}
      <div className="task-move-buttons" style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
        {canMoveLeft && (
          <button
            onClick={moveLeft}
            className="task-move-left"
            style={{ background: '#e5e7eb', border: 'none', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
          >
            ◀ Назад
          </button>
        )}
        {canMoveRight && (
          <button
            onClick={moveRight}
            className="task-move-right"
            style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
          >
            Вперёд ▶
          </button>
        )}
      </div>
    </div>
  );
}