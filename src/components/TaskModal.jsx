import React, { useState } from 'react';

export default function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ 
        id: task?.id,
        title: title.trim(), 
        description: description.trim(), 
        priority 
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{task ? '✏️ Редактировать' : '➕ Новая задача'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название задачи"
            className="modal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder="Описание (необязательно)"
            className="modal-input"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'vertical' }}
          />
          <select
            className="modal-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">🟢 Низкий приоритет</option>
            <option value="Medium">🟡 Средний приоритет</option>
            <option value="High">🔴 Высокий приоритет</option>
          </select>
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">Сохранить</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}