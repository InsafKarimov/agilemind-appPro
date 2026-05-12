import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import KanbanBoard from './KanbanBoard';
import LearningMaterials from './LearningMaterials';

export default function Dashboard({ user, projects, onUpdateProjects, onOpenQuizzes, onOpenProfile, onOpenProject, onLogout  }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [showLearning, setShowLearning] = useState(false);
  const editProject = (id, newName) => {
  const newProjects = projects.map(p => p.id === id ? { ...p, name: newName } : p);
    onUpdateProjects(newProjects);
  };

  const createProject = (name, methodology) => {
    const newProject = {
      id: Date.now(),
      name,
      methodology,
      createdAt: new Date().toLocaleDateString(),
      tasks: [],
      wipLimit: 2,
      activeSprint: null,
      quizPassed: false
    };
    onUpdateProjects([...projects, newProject]);
  };

  const deleteProject = (id) => {
    if (window.confirm('Удалить проект?')) {
      onUpdateProjects(projects.filter(p => p.id !== id));
    }
  };

  const updateProject = (updated) => {
    const newProjects = projects.map(p => p.id === updated.id ? updated : p);
    onUpdateProjects(newProjects);
    setCurrentProject(updated);
  };

  const passedCount = projects.filter(p => p.quizPassed).length;

  if (currentProject) {
    return (
      <KanbanBoard
        project={currentProject}
        onBack={() => setCurrentProject(null)}
        onUpdate={updateProject}
      />
    );
  }

  return (
    <div className="app-container">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">📊 AgileMind</h1>
            <p className="dashboard-subtitle">Управление проектами с обучением</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* <div className="badge-counter">🏅 Agile-экспертов: {passedCount} / {projects.length}</div> */}
            <button onClick={onOpenQuizzes} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>🏅 Квизы</button>
            <button onClick={() => setShowLearning(true)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>📚 Обучение</button>
            <button onClick={onOpenProfile} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>👤 Профиль</button>
            <button onClick={onLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>🚪 Выйти</button>
          </div>
        </div>
          <div className="welcome-banner">
            <div>
              <h2 className="welcome-title">
                Привет, {user.name}! 👋
              </h2>
              <p className="welcome-time">
                {new Date().getHours() < 12 ? '🌅 Доброе утро' : new Date().getHours() < 18 ? '☀️ Добрый день' : '🌙 Добрый вечер'}! 
                Продолжай развивать Agile-навыки.
              </p>
            </div>
            <div className="welcome-stats">
                              🏅 {[
                  projects.filter(p => p.quizPassed).length > 0,
                  localStorage.getItem('quiz_basics_passed') === 'true',
                  localStorage.getItem('quiz_advanced_passed') === 'true',
                  localStorage.getItem('quiz_expert_passed') === 'true',
                  localStorage.getItem('certificate_earned') === 'true',
                  localStorage.getItem('all_quizzes_completed') === 'true'
                ].filter(Boolean).length} достижений
            </div>
          </div>

            {projects.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Начните с первого проекта</h2>
              <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                AgileMind поможет управлять задачами по гибким методологиям.<br />
                Выберите Scrum, Kanban или Scrumban.
              </p>
              <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ padding: '12px 24px', fontSize: '16px' }}>
                + Создать проект
              </button>
            </div>
          ) : (
            
          <div className="project-grid">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onOpen={(project) => onOpenProject(project)} onDelete={deleteProject} onEdit={editProject} />
            ))}
            <button className="add-project-btn" onClick={() => setShowCreateModal(true)}>+</button>
          </div>
        )}

        {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} onCreate={createProject} />}
        {showLearning && <LearningMaterials onClose={() => setShowLearning(false)} />}
      </div>
      
    </div>
    
  );
}