const USERS_KEY = 'agilemind_users';
const CURRENT_USER_KEY = 'agilemind_current_user';

// Получить всех пользователей
export const loadAllUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Сохранить пользователя
export const saveUser = (user) => {
  const users = loadAllUsers();
  const existingIndex = users.findIndex(u => u.name === user.name);
  if (existingIndex !== -1) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Проверить пользователя
export const verifyUser = (name, password) => {
  const users = loadAllUsers();
  const user = users.find(u => u.name === name);
  if (!user) return false;
  return user.password === password;
};

// Проверить существование
export const userExists = (name) => {
  const users = loadAllUsers();
  return users.some(u => u.name === name);
};

// Текущий пользователь
export const loadCurrentUser = () => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const login = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name }));
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Проекты пользователя
export const saveUserProjects = (userName, projects) => {
  localStorage.setItem(`agilemind_projects_${userName}`, JSON.stringify(projects));
};

export const loadUserProjects = (userName) => {
  const data = localStorage.getItem(`agilemind_projects_${userName}`);
  return data ? JSON.parse(data) : [];

  


};

