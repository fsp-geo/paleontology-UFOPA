'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Em Andamento', value: 45, color: '#BF8F36' },
  { name: 'Concluído', value: 25, color: '#D9AA71' },
  { name: 'Aguardando', value: 20, color: '#F2D4AE' },
  { name: 'Parado', value: 10, color: '#8C8C8C' },
];

export default function SideChart() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-mining-gold-light/30 min-h-[450px] flex flex-col items-center min-w-0">
      <div className="w-full mb-6">
        <h3 className="text-xl font-black text-mining-gold-deep tracking-tight">Status dos Furos</h3>
        <p className="text-xs text-mining-gray font-bold uppercase tracking-widest mt-1">Distribuição Operacional</p>
      </div>

      <div className="relative w-full h-[260px] min-w-0">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-mining-gold-deep">124</span>
          <span className="text-[10px] text-mining-gray font-bold uppercase tracking-widest">Total Furos</span>
        </div>
      </div>

      <div className="w-full mt-6 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs font-bold text-mining-gray uppercase tracking-wider">{item.name}</span>
            </div>
            <span className="text-sm font-black text-mining-gold-deep">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
