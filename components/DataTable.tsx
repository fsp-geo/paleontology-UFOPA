'use client';

import React from 'react';
import { MoreVertical, Search, Filter, Download } from 'lucide-react';

const furos = [
  { id: 'F-2024-001', sonda: 'S-01', profundidade: '124m', status: 'Em Andamento', progresso: 65, inicio: '08 Mar 2024' },
  { id: 'F-2024-002', sonda: 'S-03', profundidade: '85m', status: 'Concluído', progresso: 100, inicio: '07 Mar 2024' },
  { id: 'F-2024-003', sonda: 'S-02', profundidade: '42m', status: 'Parado', progresso: 30, inicio: '09 Mar 2024' },
  { id: 'F-2024-004', sonda: 'S-01', profundidade: '12m', status: 'Em Andamento', progresso: 10, inicio: '10 Mar 2024' },
  { id: 'F-2024-005', sonda: 'S-04', profundidade: '210m', status: 'Aguardando', progresso: 0, inicio: '11 Mar 2024' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Em Andamento': return 'bg-mining-gold-deep text-white';
    case 'Concluído': return 'bg-emerald-500 text-white';
    case 'Parado': return 'bg-rose-500 text-white';
    case 'Aguardando': return 'bg-mining-gray text-white';
    default: return 'bg-mining-off-white text-mining-gray';
  }
};

export default function DataTable() {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-mining-gold-light/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-black text-mining-gold-deep tracking-tight">Controle de Furos</h3>
          <p className="text-xs text-mining-gray font-bold uppercase tracking-widest mt-1">Monitoramento em tempo real das sondas</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl bg-mining-off-white text-mining-gray hover:bg-mining-gold-light/30 hover:text-mining-gold-deep transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-2xl bg-mining-off-white text-mining-gray hover:bg-mining-gold-light/30 hover:text-mining-gold-deep transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
          <button className="bg-mining-gold-deep text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-mining-gold-muted transition-all">
            Novo Furo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-mining-gray text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 pb-2">ID do Furo</th>
              <th className="px-6 pb-2">Sonda</th>
              <th className="px-6 pb-2">Profundidade</th>
              <th className="px-6 pb-2">Progresso</th>
              <th className="px-6 pb-2">Status</th>
              <th className="px-6 pb-2">Início</th>
              <th className="px-6 pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {furos.map((furo) => (
              <tr key={furo.id} className="group hover:bg-mining-off-white/50 transition-all duration-300">
                <td className="px-6 py-5 bg-mining-off-white/30 rounded-l-2xl border-y border-l border-mining-gold-light/20">
                  <span className="text-sm font-black text-mining-gold-deep">{furo.id}</span>
                </td>
                <td className="px-6 py-5 bg-mining-off-white/30 border-y border-mining-gold-light/20">
                  <span className="text-sm font-bold text-mining-gray">{furo.sonda}</span>
                </td>
                <td className="px-6 py-5 bg-mining-off-white/30 border-y border-mining-gold-light/20">
                  <span className="text-sm font-bold text-mining-gold-deep">{furo.profundidade}</span>
                </td>
                <td className="px-6 py-5 bg-mining-off-white/30 border-y border-mining-gold-light/20 min-w-[150px]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-mining-gold-light/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-mining-gold-deep rounded-full transition-all duration-1000" 
                        style={{ width: `${furo.progresso}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-black text-mining-gold-deep">{furo.progresso}%</span>
                  </div>
                </td>
                <td className="px-6 py-5 bg-mining-off-white/30 border-y border-mining-gold-light/20">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(furo.status)}`}>
                    {furo.status}
                  </span>
                </td>
                <td className="px-6 py-5 bg-mining-off-white/30 border-y border-mining-gold-light/20">
                  <span className="text-xs font-bold text-mining-gray">{furo.inicio}</span>
                </td>
                <td className="px-6 py-5 bg-mining-off-white/30 rounded-r-2xl border-y border-r border-mining-gold-light/20 text-right">
                  <button className="p-2 text-mining-gray hover:text-mining-gold-deep transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
