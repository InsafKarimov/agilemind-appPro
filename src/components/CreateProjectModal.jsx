import React, { useState } from 'react';
import Modal from './Modal';

export default function CreateProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [methodology, setMethodology] = useState('Scrumban');

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), methodology);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="📁 Создать проект"
      buttons={[
        { text: 'Создать', onClick: handleCreate, variant: 'success' },
        { text: 'Отмена', onClick: onClose, variant: 'default' }
      ]}
    >
      <input
        type="text"
        placeholder="Название проекта"
        className="modal-input"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 25))}
        maxLength={25}
        autoFocus
      />
      <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '-8px', marginBottom: '8px' }}>
        {name.length}/25 символов
      </p>
      <select
        className="modal-select"
        value={methodology}
        onChange={(e) => setMethodology(e.target.value)}
      >
        <option value="Scrum">🏃 Scrum (только спринты)</option>
        <option value="Kanban">📋 Kanban (только WIP)</option>
        <option value="Scrumban">🔄 Scrumban (спринты + WIP) 🌟</option>
      </select>
    </Modal>
  );
}