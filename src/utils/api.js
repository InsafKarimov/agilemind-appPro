const API_URL = 'https://agilemind-sandbox-backend.onrender.com/api';

// Включаем отправку cookie
const fetchWithCredentials = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};

// ===== АУТЕНТИФИКАЦИЯ =====
export const register = async (username, password) => {
  const res = await fetchWithCredentials(`${API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const login = async (username, password) => {
  const res = await fetchWithCredentials(`${API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const logout = async () => {
  await fetchWithCredentials(`${API_URL}/logout`, { method: 'POST' });
};

// ===== ПРОЕКТЫ =====
export const getProjects = async () => {
  const res = await fetchWithCredentials(`${API_URL}/projects`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const saveProjects = async (projects) => {
  const res = await fetchWithCredentials(`${API_URL}/projects`, {
    method: 'POST',
    body: JSON.stringify({ projects })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

// ===== ДОСТИЖЕНИЯ =====
export const getAchievements = async () => {
  const res = await fetchWithCredentials(`${API_URL}/achievements`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const addAchievement = async (key) => {
  const res = await fetchWithCredentials(`${API_URL}/achievements`, {
    method: 'POST',
    body: JSON.stringify({ key })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

// ===== ОБУЧЕНИЕ =====
export const getLearningProgress = async () => {
  const res = await fetchWithCredentials(`${API_URL}/learning`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const saveLearningProgress = async (modules) => {
  const res = await fetchWithCredentials(`${API_URL}/learning`, {
    method: 'POST',
    body: JSON.stringify({ modules })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

// ===== ДОСТУП К ПОЛЬЗОВАТЕЛЮ =====
export const getCurrentUser = () => {
  return localStorage.getItem('user');
};