'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({ label, value, change, isPositive, icon: Icon, color = 'mining-gold-deep' }: StatsCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-mining-gold-light/40 flex flex-col justify-between h-full group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-mining-gold-light/20 flex items-center justify-center text-mining-gold-deep group-hover:bg-mining-gold-deep group-hover:text-white transition-all duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-mining-gray text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-mining-gold-deep tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
}
