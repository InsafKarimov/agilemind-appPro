import React, { useState, useRef, useEffect } from 'react';

const FAQ = [
  { q: /wip|лимит/i, a: '📊 WIP-лимит — зелёная кнопка над колонкой «В работе». Установи 2-3 задачи на человека — это ускорит поток.' },
  { q: /agile/i, a: '🔄 Agile — подход с итерациями. Вместо долгого плана — короткие спринты и частая обратная связь.' },
  { q: /scrum/i, a: '🏃 Scrum — спринты (1-4 недели), роли (Product Owner, Scrum Master, команда), события (планирование, стендап, ретроспектива).' },
  { q: /kanban/i, a: '📋 Kanban — доска с колонками и WIP-лимитами. Нет спринтов, задачи идут непрерывно.' },
  { q: /scrumban/i, a: '🔄 Scrumban — гибрид. Есть спринты (как в Scrum) и WIP-лимиты (как в Kanban). Реализовано в проекте!' },
  { q: /ретроспектив/i, a: '📝 Ретроспектива — встреча после спринта. Что сделали лучше? Что мешает? (В проекте — заглушка, можно доработать в будущем).' },
  { q: /стендап|daily/i, a: '☀️ Daily — 15 минут, 3 вопроса: что сделал вчера? что сделаю сегодня? какие проблемы?' },
  { q: /product owner/i, a: '👑 Product Owner — управляет бэклогом, ставит приоритеты, отвечает за ценность.' },
  { q: /scrum master/i, a: '🛡️ Scrum Master — убирает препятствия, учит команду следовать процессу.' },
  { q: /story points/i, a: '🎯 Story points — оценка сложности (1,2,3,5,8...). Не часы, а относительная сложность.' },
  { q: /инкремент/i, a: '📦 Инкремент — работающая версия продукта после спринта.' },
  { q: /театр|agile-театр/i, a: '🎭 Agile-театр — стендапы и ретроспективы «для галочки», без изменений. Проект помогает бороться с этим через умные подсказки.' },
  { q: /сертификат/i, a: '🎓 Сертификат выдаётся после прохождения 4 модулей в разделе «Обучение». Появляется в профиле.' },
];

const getAIResponse = (question) => {
  for (const item of FAQ) {
    if (item.q.test(question)) {
      return item.a;
    }
  }
  return `📚 Хороший вопрос про "${question}"! В дипломе эта тема раскрыта. Рекомендую изучить раздел «Обучение» или пройти квиз.`;
};

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Привет! Я AI-ассистент AgileMind. Спроси меня про Agile, Scrum, Kanban, WIP-лимиты или Scrumban! 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 999,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        🤖
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: 'min(90vw, 380px)',
            height: 'min(70vh, 500px)',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontWeight: 'bold' }}>🤖 AgileMind AI</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <div
                  style={{
                    background: msg.role === 'user' ? '#4f46e5' : '#f3f4f6',
                    color: msg.role === 'user' ? 'white' : '#1f2937',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    fontSize: '14px',
                    wordWrap: 'break-word'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{ background: '#f3f4f6', padding: '10px 14px', borderRadius: '4px 18px 18px 18px', fontSize: '14px' }}>
                  🤔 Думаю...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Спроси про Agile..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 20px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      )}
    </>
  );
}