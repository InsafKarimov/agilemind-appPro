import React, { useState } from 'react';
import { login, register } from '../utils/api';

export default function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const data = await login(username, password);
        // ✅ СОХРАНЯЕМ ТОКЕН ДЛЯ WEBSOCKET
        window.socketToken = data.token;
        onLogin(data.username);
      } else {
        if (password !== confirmPassword) {
          setError('Пароли не совпадают');
          setLoading(false);
          return;
        }
        const data = await register(username, password);
        // ✅ СОХРАНЯЕМ ТОКЕН ДЛЯ WEBSOCKET
        window.socketToken = data.token;
        onLogin(data.username);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-title">🎯 AgileMind</div>
        <div className="login-subtitle">Agile-управление проектами с встроенным обучением</div>
        
        <div className="login-tabs">
          <button className={`login-tab ${isLogin ? 'login-tab-active' : ''}`} onClick={() => { setIsLogin(true); setError(''); }}>Вход</button>
          <button className={`login-tab ${!isLogin ? 'login-tab-active' : ''}`} onClick={() => { setIsLogin(false); setError(''); }}>Регистрация</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Имя пользователя" 
            className="login-input" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Пароль" 
              className="login-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ paddingRight: '40px' }} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: 'absolute', right: '12px', top: '40%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {!isLogin && (
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Подтвердите пароль" 
              className="login-input" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          )}

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
        
        <div className="login-note">🔐 Все данные защищены и хранятся на сервере</div>
      </div>
    </div>
  );
}