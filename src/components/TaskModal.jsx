import React, { useState } from 'react';
import Modal from './Modal';

export default function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [priority, setPriority] = useState(task?.priority || 'Medium');

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title: title.trim(), priority });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={task ? '✏️ Редактировать задачу' : '➕ Новая задача'}
      buttons={[
        { text: 'Сохранить', onClick: handleSave, variant: 'success' },
        { text: 'Отмена', onClick: onClose, variant: 'default' }
      ]}
    >
      <input
        type="text"
        placeholder="Название задачи"
        className="modal-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
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
    </Modal>
  );
}