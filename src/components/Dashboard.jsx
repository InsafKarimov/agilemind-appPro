import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import KanbanBoard from './KanbanBoard';
import LearningMaterials from './LearningMaterials';
import TeamPage from './TeamPage';
import ConfirmModal from './ConfirmModal';
import EditProjectModal from './EditProjectModal';
import { getAchievements } from '../utils/api';

export default function Dashboard({ 
  user, 
  projects, 
  onUpdateProjects, 
  onOpenQuizzes, 
  onOpenProfile, 
  onOpenProject, 
  onLogout 
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [showLearning, setShowLearning] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    getAchievements()
      .then(data => setAchievementsCount(data.length))
      .catch(() => setAchievementsCount(0));
  }, []);

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

  const deleteProject = () => {
    if (projectToDelete) {
      onUpdateProjects(projects.filter(p => p.id !== projectToDelete));
      setProjectToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const updateProject = (updated) => {
    const newProjects = projects.map(p => p.id === updated.id ? updated : p);
    onUpdateProjects(newProjects);
    setCurrentProject(updated);
  };

  if (showTeam) {
  return <TeamPage onBack={() => setShowTeam(false)} user={user} />;
}

  /* if (showTeam) {
    return <TeamPage onBack={() => setShowTeam(false)} />;
  } */

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
            <button 
              onClick={() => setShowTeam(true)} 
              className="btn-team" 
              title="☀️ Ежедневный стендап и ретроспектива"
            >
              👥 Команда
            </button>
            <button 
              onClick={onOpenQuizzes} 
              style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }} 
              title="🧠 Проверить знания по Agile"
            >
              🏅 Квизы
            </button>
            <button 
              onClick={() => setShowLearning(true)} 
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }} 
              title="📚 4 модуля по Agile, Scrum, Kanban, Scrumban"
            >
              📚 Обучение
            </button>
            <button 
              onClick={onOpenProfile} 
              style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }} 
              title="👤 Личный кабинет: достижения, статистика, сертификаты"
            >
              👤 Профиль
            </button>
            <button 
              onClick={onLogout} 
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
            >
              🚪 Выйти
            </button>
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
            🏅 {achievementsCount} достижений
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
              <ProjectCard 
                key={p.id} 
                project={p} 
                onOpen={(project) => onOpenProject(project)} 
                onDelete={(id) => {
                  setProjectToDelete(id);
                  setShowDeleteConfirm(true);
                }} 
                onEdit={(project) => {
                  setEditingProject(project);
                  setShowEditModal(true);
                }} 
              />
            ))}
            <button className="add-project-btn" onClick={() => setShowCreateModal(true)}>+</button>
          </div>
        )}

        {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} onCreate={createProject} />}
        {showLearning && <LearningMaterials onClose={() => setShowLearning(false)} />}

        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={deleteProject}
          title="Удалить проект?"
          message="Все задачи проекта будут потеряны. Это действие нельзя отменить."
        />

        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onSave={editProject}
        />
      </div>
    </div>
  );
}