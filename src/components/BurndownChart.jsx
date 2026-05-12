import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BurndownChart({ tasks, sprintDays = 14 }) {
  // Считаем общее количество задач
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  
  // Генерируем данные для графика
  const data = [];
  const remainingPerDay = Math.ceil(totalTasks / sprintDays);
  let remaining = totalTasks;
  
  for (let day = 0; day <= sprintDays; day++) {
    if (day === 0) {
      data.push({ day: 'Старт', remaining });
    } else if (day === sprintDays) {
      data.push({ day: 'Финиш', remaining: 0 });
    } else {
      remaining = Math.max(0, remaining - remainingPerDay);
      data.push({ day: `День ${day}`, remaining });
    }
  }
  
  // Идеальная линия (равномерное сгорание)
  const idealData = [];
  for (let day = 0; day <= sprintDays; day++) {
    const idealRemaining = Math.max(0, totalTasks - (totalTasks / sprintDays) * day);
    idealData.push({ remaining: Math.round(idealRemaining) });
  }
  
  const chartData = data.map((item, idx) => ({
    day: item.day,
    план: idealData[idx]?.remaining || 0,
    факт: idx === 0 ? totalTasks : (idx === sprintDays ? 0 : item.remaining)
  }));

  return (
    <div className="burndown-container">
      <h3 className="burndown-title">📉 Burndown Chart</h3>
      <p className="burndown-stats">
        Всего задач: {totalTasks} | Выполнено: {completedTasks} | Осталось: {totalTasks - completedTasks}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip contentStyle={{ background: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          <Line type="monotone" dataKey="план" stroke="#10b981" strokeWidth={2} dot={false} name="План" />
          <Line type="monotone" dataKey="факт" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, strokeWidth: 0 }} name="Факт" />
        </LineChart>
      </ResponsiveContainer>
      <p className="burndown-note">
        💡 Зелёная линия — идеальный темп. Красная — реальное выполнение. Чем ближе красная к зелёной, тем лучше.
      </p>
    </div>
  );
}