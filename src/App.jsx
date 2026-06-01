import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import QuizzesPage from './components/QuizzesPage';
import Profile from './components/Profile';
import KanbanBoard from './components/KanbanBoard';
import AiAssistant from './components/AiAssistant';
import { getProjects, saveProjects, logout as apiLogout } from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser({ name: savedUser });
      getProjects()
        .then(setProjects)
        .catch(() => {
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem('user', username);
    setUser({ name: username });
    setCurrentScreen('dashboard');
    getProjects().then(setProjects).catch(() => {});
  };

  const handleLogout = async () => {
    await apiLogout();
    localStorage.removeItem('user');
    setUser(null);
    setProjects([]);
    setCurrentScreen('login');
  };

  const updateProjects = async (newProjects) => {
    setProjects(newProjects);
    await saveProjects(newProjects);
  };

  if (loading) return <div className="loading">Загрузка...</div>;

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
      <AiAssistant />
    </div>
  );
}

export default App;