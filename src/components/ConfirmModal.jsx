import React from 'react';
import Modal from './Modal';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Подтверждение'}
      message={message || 'Вы уверены?'}
      buttons={[
        { text: 'Да', onClick: onConfirm, variant: 'danger' },
        { text: 'Отмена', onClick: onClose, variant: 'default' }
      ]}
    />
  );
}