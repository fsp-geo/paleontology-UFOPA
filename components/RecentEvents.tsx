'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  Pickaxe,
  FlaskConical,
  Package
} from 'lucide-react';

const events = [
  { 
    id: 1, 
    type: 'success', 
    title: 'Furo F-2024-002 Concluído', 
    time: 'Há 15 min', 
    icon: Pickaxe,
    description: 'Profundidade final de 85m atingida pela Sonda S-03.'
  },
  { 
    id: 2, 
    type: 'alert', 
    title: 'Alerta de Manutenção', 
    time: 'Há 45 min', 
    icon: AlertCircle,
    description: 'Sonda S-02 apresenta vibração excessiva no motor.'
  },
  { 
    id: 3, 
    type: 'info', 
    title: 'Lote L-982 Recebido', 
    time: 'Há 2 horas', 
    icon: Package,
    description: 'Lote de amostras da zona Norte pronto para laboratório.'
  },
  { 
    id: 4, 
    type: 'success', 
    title: 'Resultado de Análise', 
    time: 'Há 3 horas', 
    icon: FlaskConical,
    description: 'Amostras do furo F-2024-001 processadas com sucesso.'
  },
];

const getIconColor = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-50 text-emerald-600';
    case 'alert': return 'bg-rose-50 text-rose-600';
    case 'info': return 'bg-mining-gold-light/20 text-mining-gold-deep';
    default: return 'bg-mining-off-white text-mining-gray';
  }
};

export default function RecentEvents() {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-mining-gold-light/30 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-mining-gold-deep tracking-tight">Eventos Operacionais</h3>
          <p className="text-xs text-mining-gray font-bold uppercase tracking-widest mt-1">Atividade Recente</p>
        </div>
        <button className="text-[10px] font-black text-mining-gold-deep uppercase tracking-widest hover:underline">Ver Tudo</button>
      </div>

      <div className="flex-1 space-y-6">
        {events.map((event, index) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 group cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${getIconColor(event.type)}`}>
              <event.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-black text-mining-gold-deep truncate">{event.title}</h4>
                <span className="text-[10px] font-bold text-mining-gray uppercase whitespace-nowrap ml-2">{event.time}</span>
              </div>
              <p className="text-xs text-mining-gray font-medium leading-relaxed line-clamp-2">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-mining-gold-light/30">
        <div className="bg-mining-off-white/50 p-4 rounded-2xl border border-mining-gold-light/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-mining-gray uppercase tracking-widest">Status do Sistema</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
            </div>
          </div>
          <p className="text-[11px] text-mining-gray font-bold leading-tight">Todos os sensores e sondas operando dentro dos parâmetros normais.</p>
        </div>
      </div>
    </div>
  );
}
