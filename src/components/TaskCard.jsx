import React from 'react';

export default function TaskCard({ task, onDelete, onEdit, isDraggable = true }) {
  const priorityColors = {
    Low: 'border-l-green-500',
    Medium: 'border-l-yellow-500',
    High: 'border-l-red-500'
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
    </div>
  );
}