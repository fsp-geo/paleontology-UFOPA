'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Compass,
  Package,
  FlaskConical,
  Beaker,
  BarChart3,
  AlertTriangle,
  FileText,
  Settings,
  Pickaxe,
  LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { isLocalDemoMode } from '@/lib/demo-mode';

const navItems = [
  { name: 'Visao Geral', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Sondagem', icon: Compass, href: '/dashboard/sondagem' },
  { name: 'Furos', icon: Pickaxe, href: '/dashboard/furos' },
  { name: 'Lotes', icon: Package, href: '/dashboard/lotes' },
  { name: 'Amostras', icon: FlaskConical, href: '/dashboard/amostras' },
  { name: 'Laboratorio', icon: Beaker, href: '/dashboard/laboratorio' },
  { name: 'Produtividade', icon: BarChart3, href: '/dashboard/produtividade' },
  { name: 'Alertas', icon: AlertTriangle, href: '/dashboard/alertas' },
  { name: 'Relatorios', icon: FileText, href: '/dashboard/relatorios' },
  { name: 'Configuracoes', icon: Settings, href: '/dashboard/configuracoes' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogout = async () => {
    if (!isLocalDemoMode && supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-mining-off-white border-r border-mining-gold-light h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-4 border-b border-mining-gold-light bg-mining-gold-light/20">
        <div className="w-14 h-14 relative overflow-hidden">
          <Image
            src="https://github.com/user-attachments/assets/7154dc4b-1267-4ce1-af94-0ab59f2982a2"
            alt="Mining Logo"
            fill
            sizes="56px"
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="font-bold text-mining-gold-deep leading-none">MAGELLAN</h1>
          <span className="text-[10px] text-mining-gray uppercase tracking-widest font-semibold">Operational</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-mining-gold-deep text-white shadow-md'
                  : 'text-mining-gray hover:bg-mining-gold-light/30 hover:text-mining-gold-deep'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-mining-gray group-hover:text-mining-gold-deep'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-mining-gold-light bg-mining-gold-light/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-mining-gold-light hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300 group shadow-sm"
        >
          <LogOut className="w-5 h-5 text-mining-gray group-hover:text-red-600" />
          <span className="font-black text-xs uppercase tracking-widest">
            {isLocalDemoMode ? 'Voltar ao Inicio' : 'Sair do Sistema'}
          </span>
        </button>

        <div className="mt-4 flex flex-col items-center">
          <span className="text-[9px] text-mining-gray uppercase tracking-[0.2em] font-bold">Tempo de Atividade</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-mining-gold-deep">{formatTime(sessionTime)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
