import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function SkillChart({ skills }) {
  const chartData = skills && skills.length > 0 ? skills.map(s => ({
    name: s.skill_name || s.name,
    score: s.proficiency_score || s.proficiencyScore || 50,
  })) : [
    { name: 'Git', score: 90 },
    { name: 'HTML5', score: 90 },
    { name: 'CSS3', score: 85 },
    { name: 'JavaScript', score: 82 },
    { name: 'MySQL', score: 73 },
    { name: 'React.js', score: 64 },
    { name: 'Node.js', score: 51 },
  ];

  const getBarColor = (score) => {
    if (score >= 80) return '#10b981'; // Emerald
    if (score >= 60) return '#06b6d4'; // Cyan
    if (score >= 40) return '#7c5cf7'; // Purple
    return '#f59e0b'; // Amber
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#12141d', borderColor: '#232738', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            formatter={(value) => [`${value}%`, 'Proficiency Score']}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
