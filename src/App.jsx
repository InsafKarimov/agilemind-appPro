import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import QuizzesPage from './components/QuizzesPage';
import Profile from './components/Profile';
import { loadCurrentUser, login, logout, loadUserProjects, saveUserProjects } from './utils/localStorage';
import KanbanBoard from './components/KanbanBoard';

function App() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(() => {
    return localStorage.getItem('currentScreen') || 'dashboard';
  });
  const [currentProjectId, setCurrentProjectId] = useState(() => {
    const saved = localStorage.getItem('currentProjectId');
    return saved ? parseInt(saved) : null;
  });

  useEffect(() => {
    const savedUser = loadCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      const savedProjects = loadUserProjects(savedUser.name);
      setProjects(savedProjects);
    }
  }, []);

  useEffect(() => {
    if (user && currentScreen !== 'login') {
      localStorage.setItem('currentScreen', currentScreen);
      if (currentProjectId) {
        localStorage.setItem('currentProjectId', currentProjectId);
      } else {
        localStorage.removeItem('currentProjectId');
      }
    }
  }, [currentScreen, currentProjectId, user]);

  const handleLogin = (name) => {
    const newUser = { name };
    setUser(newUser);
    login(newUser);
    const savedProjects = loadUserProjects(name);
    setProjects(savedProjects);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setProjects([]);
    localStorage.removeItem('currentScreen');
  };

  const updateProjects = (newProjects) => {
    setProjects(newProjects);
    if (user) {
      saveUserProjects(user.name, newProjects);
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const openProject = projects.find(p => p.id === currentProjectId);

  if (currentScreen === 'project' && openProject) {
    return (
      <KanbanBoard
        project={openProject}
        onBack={() => {
          setCurrentScreen('dashboard');
          setCurrentProjectId(null);
        }}
        onUpdate={(updated) => {
          const newProjects = projects.map(p => p.id === updated.id ? updated : p);
          updateProjects(newProjects);
        }}
      />
    );
  }

  if (currentScreen === 'quizzes') {
    return <QuizzesPage onBack={() => setCurrentScreen('dashboard')} />;
  }

  if (currentScreen === 'profile') {
    return (
      <Profile
        user={user}
        projects={projects}
        onClose={() => setCurrentScreen('dashboard')}
      />
    );
  }

  return (
    <div className="app-wrapper">
      <div className="main-content">
        <Dashboard
          user={user}
          projects={projects}
          onUpdateProjects={updateProjects}
          onOpenQuizzes={() => setCurrentScreen('quizzes')}
          onOpenProfile={() => setCurrentScreen('profile')}
          onOpenProject={(project) => {
            setCurrentProjectId(project.id);
            setCurrentScreen('project');
          }}
          onLogout={handleLogout}
        />
      </div>
      <footer className="app-footer">
        <p>
        AgileMind — дипломный проект по управлению проектами с интерактивным обучением<br />
        © {new Date().getFullYear()} Каримов Инсаф, КНИТУ-КАИ
      </p>
      <p style={{ marginTop: '8px' }}>
        🎓 WIP-лимиты · Scrumban · Квизы · Обучение Agile · Достижения
      </p>
      </footer>
    </div>
  );
}

export default App;