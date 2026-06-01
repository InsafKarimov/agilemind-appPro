import React from 'react';

/**
 * Универсальный компонент модального окна
 * @param {boolean} isOpen - открыта ли модалка
 * @param {function} onClose - функция закрытия
 * @param {string} title - заголовок
 * @param {string} message - сообщение
 * @param {array} buttons - массив кнопок [{ text, onClick, variant }]
 * @param {ReactNode} children - содержимое (опционально)
 */
export default function Modal({ isOpen, onClose, title, message, buttons, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        
        {message && <p className="modal-message">{message}</p>}
        
        {children}
        
        {buttons && buttons.length > 0 && (
          <div className="modal-buttons">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                className={`modal-btn ${btn.variant === 'danger' ? 'modal-btn-danger' : btn.variant === 'success' ? 'modal-btn-success' : 'modal-btn-default'}`}
                onClick={btn.onClick}
              >
                {btn.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}