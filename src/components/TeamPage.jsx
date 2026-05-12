import React from 'react';

export default function TeamPage({ onBack }) {
  return (
    <div className="team-page">
      <button className="back-link" onClick={onBack}>← На главную</button>
      
      <h1 className="team-title">👥 Команда AgileMind</h1>
      <p className="team-subtitle">Agile-ритуалы и командные практики</p>

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
    </div>
  );
}