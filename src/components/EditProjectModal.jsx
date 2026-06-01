import React, { useState } from 'react';
import Modal from './Modal';

export default function EditProjectModal({ isOpen, onClose, project, onSave }) {
  const [name, setName] = useState(project?.name || '');

  const handleSave = () => {
    if (name.trim() && project) {
      onSave(project.id, name.trim());
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✏️ Редактировать проект"
      buttons={[
        { text: 'Сохранить', onClick: handleSave, variant: 'success' },
        { text: 'Отмена', onClick: onClose, variant: 'default' }
      ]}
    >
      <input
        type="text"
        placeholder="Название проекта"
        className="modal-input"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 25))}  // ← ограничение 25 символов
        maxLength={25}  // ← дополнительная защита
        autoFocus
      />
      <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '-8px', marginBottom: '8px' }}>
        {name.length}/25 символов
      </p>
    </Modal>
  );
}