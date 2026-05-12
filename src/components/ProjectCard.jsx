import React from 'react';

export default function ProjectCard({ project, onOpen, onDelete, onEdit }) {
  const methodologyIcon = {
    Scrum: '🏃',
    Kanban: '📋',
    Scrumban: '🔄'
  };

  return (
    <div className="project-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="project-name">{project.name}</h3>
        <button 
          onClick={() => {
            const newName = prompt('Новое название проекта:', project.name);
            if (newName && newName.trim()) {
              onEdit(project.id, newName.trim());
            }
          }}
          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6b7280' }}
          title="Редактировать название"
        >
          ✏️
        </button>
      </div>
      <div className="project-meta">
        <span>{methodologyIcon[project.methodology]} {project.methodology}</span>
        <span>•</span>
        <span>📅 {project.createdAt}</span>
      </div>
      <p className="project-stats">📋 {project.tasks?.length || 0} задач</p>
      <div className="project-actions">
        <button className="btn-open" onClick={() => onOpen(project)}>Открыть</button>
        <button className="btn-delete" onClick={() => onDelete(project.id)}>🗑️</button>
      </div>
      {project.quizPassed && (
        <div className="project-badge">
          <span>🏅</span>
          <span>Знаток Agile</span>
        </div>
      )}
    </div>
  );
}