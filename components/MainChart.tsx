'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Seg', metros: 450, previsto: 400 },
  { name: 'Ter', metros: 520, previsto: 400 },
  { name: 'Qua', metros: 480, previsto: 400 },
  { name: 'Qui', metros: 610, previsto: 400 },
  { name: 'Sex', metros: 550, previsto: 400 },
  { name: 'Sáb', metros: 420, previsto: 400 },
  { name: 'Dom', metros: 380, previsto: 400 },
];

export default function MainChart() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-mining-gold-light/30 min-h-[450px] flex flex-col min-w-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-mining-gold-deep tracking-tight">Avanço de Sondagem</h3>
          <p className="text-xs text-mining-gray font-bold uppercase tracking-widest mt-1">Produção diária vs Meta (Metros)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-mining-gold-deep"></div>
            <span className="text-[10px] font-bold text-mining-gray uppercase tracking-widest">Realizado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-mining-gold-light"></div>
            <span className="text-[10px] font-bold text-mining-gray uppercase tracking-widest">Meta</span>
          </div>
          <select className="bg-mining-off-white border border-mining-gold-light rounded-xl px-4 py-2 text-xs font-bold text-mining-gold-deep focus:outline-none shadow-sm">
            <option>Esta Semana</option>
            <option>Últimos 30 dias</option>
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] min-w-0">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetros" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BF8F36" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#BF8F36" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8C8C8C', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8C8C8C', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 700 }}
              />
              <Area 
                type="monotone" 
                dataKey="metros" 
                stroke="#BF8F36" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorMetros)" 
                animationDuration={2000}
              />
              <Area 
                type="monotone" 
                dataKey="previsto" 
                stroke="#F2D4AE" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
