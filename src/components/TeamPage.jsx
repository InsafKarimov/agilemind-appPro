import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ConfirmModal from './ConfirmModal';

export default function TeamPage({ onBack, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5002', {
      auth: { username: user?.name || 'Гость', token }
    });
    
    newSocket.on('chat history', (history) => {
      setMessages(history);
    });
    
    newSocket.on('chat message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    newSocket.on('message deleted', (messageId) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });
    
    setSocket(newSocket);
    
    return () => newSocket.close();
  }, [user?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    socket.emit('chat message', newMessage.trim());
    setNewMessage('');
  };

  const handleDeleteClick = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      socket.emit('delete message', messageToDelete);
      setMessageToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="team-page">
      <button className="back-link" onClick={onBack}>← На главную</button>
      
      <h1 className="team-title">👥 Команда AgileMind</h1>
      <p className="team-subtitle">Agile-ритуалы, командные практики и живой чат</p>

      {/* Стендап */}
      <div className="team-card standup-card">
        <div className="team-card-icon">☀️</div>
        <div className="team-card-content">
          <h3>Ежедневный стендап (Daily Scrum)</h3>
          <p>15 минут, ответы на 3 вопроса:</p>
          <ul>
            <li>✅ <strong>Что сделал вчера?</strong> — что удалось завершить</li>
            <li>🔄 <strong>Что сделаю сегодня?</strong> — план на день</li>
            <li>⚠️ <strong>Какие проблемы?</strong> — блокеры и помощь</li>
          </ul>
          <button className="btn-secondary disabled" disabled>➕ Добавить отчёт (будет в v2.0)</button>
        </div>
      </div>

      {/* Ретроспектива */}
      <div className="team-card retro-card">
        <div className="team-card-icon">📝</div>
        <div className="team-card-content">
          <h3>Ретроспектива спринта</h3>
          <p>Встреча после завершения спринта для улучшения процессов:</p>
          <ul>
            <li>🟢 <strong>Что прошло хорошо?</strong> — успехи и удачные практики</li>
            <li>🔴 <strong>Что было плохо?</strong> — проблемы и неудачи</li>
            <li>🟡 <strong>Что улучшить?</strong> — идеи и эксперименты</li>
          </ul>
          <button className="btn-secondary disabled" disabled>➕ Провести ретро (будет в v2.0)</button>
        </div>
      </div>

      {/* Цель спринта */}
      <div className="team-card goal-card">
        <div className="team-card-icon">🎯</div>
        <div className="team-card-content">
          <h3>Цель текущего спринта</h3>
          <p>Краткая формулировка того, зачем нужен спринт.</p>
          <div className="goal-placeholder">
            <em>Пример: «Завершить настройку WIP-лимитов и протестировать подсказки»</em>
          </div>
          <button className="btn-secondary disabled" disabled>✏️ Редактировать (будет в v2.0)</button>
        </div>
      </div>

      {/* Напоминалка */}
      <div className="team-card reminder-card">
        <div className="team-card-icon">💡</div>
        <div className="team-card-content">
          <h3>Зачем это всё?</h3>
          <p>
            <strong>Ежедневный стендап</strong> — синхронизация команды, выявление проблем.<br/>
            <strong>Ретроспектива</strong> — постоянное улучшение процессов, борьба с «Agile-театром».<br/>
            <strong>Цель спринта</strong> — фокус команды на результате, а не на задачах.
          </p>
        </div>
      </div>

      {/* Чат */}
      <div className="chat-section">
        <h3 className="chat-title">💬 Чат с командой</h3>
        <div className="chat-messages">
          {messages.length === 0 && <p className="chat-empty">Нет сообщений</p>}
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.username === user?.name ? 'chat-message-mine' : ''}`}>
              <div className="chat-message-username">{msg.username}</div>
              <div className="chat-message-text">{msg.message}</div>
              <div className="chat-message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
                {msg.username === user?.name && (
                  <button 
                    onClick={() => handleDeleteClick(msg.id)}
                    className="chat-delete-btn"
                    title="Удалить сообщение"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            placeholder="Напишите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Удалить сообщение?"
        message="Это действие нельзя отменить."
      />
    </div>
  );
}
