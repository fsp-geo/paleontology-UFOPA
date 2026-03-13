'use client';

import React from 'react';
import { Search, Bell, User, Settings2 } from 'lucide-react';

import Image from 'next/image';

export default function DashboardHeader() {
  return (
    <header className="h-20 bg-mining-bg border-b border-mining-gold-light flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mining-gray w-5 h-5 group-focus-within:text-mining-gold-deep transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar furos, lotes ou amostras..." 
            className="w-full bg-mining-off-white border border-mining-gold-light rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-mining-gold-muted focus:bg-white transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 rounded-2xl bg-mining-off-white text-mining-gray hover:bg-mining-gold-light/30 hover:text-mining-gold-deep transition-all relative shadow-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-mining-gold-deep border-2 border-mining-bg rounded-full"></span>
        </button>
        <button className="p-3 rounded-2xl bg-mining-off-white text-mining-gray hover:bg-mining-gold-light/30 hover:text-mining-gold-deep transition-all shadow-sm">
          <Settings2 className="w-5 h-5" />
        </button>
        <div className="h-10 w-[1px] bg-mining-gold-light mx-2"></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-mining-gold-deep">Eng. Ricardo Silva</p>
            <p className="text-[10px] text-mining-gray uppercase tracking-widest font-semibold">Supervisor Operacional</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-mining-gold-light border-2 border-white shadow-md flex items-center justify-center text-mining-gold-deep font-bold overflow-hidden relative">
            <Image 
              src="https://picsum.photos/seed/engineer/100/100" 
              alt="User" 
              fill
              sizes="48px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
