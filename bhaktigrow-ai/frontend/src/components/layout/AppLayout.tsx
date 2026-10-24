import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { SacredMandalaSVG } from '../devotional/DevotionalIcons';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex relative overflow-x-hidden font-sans">
      {/* Subtle Background Devotional Ambient Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Decorative Faint Mandala in Top Corner */}
      <div className="fixed top-10 right-10 pointer-events-none opacity-5 -z-10 rotate-45">
        <SacredMandalaSVG className="w-96 h-96" />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Mobile Drawer */}
      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer Disclaimer */}
        <footer className="border-t border-slate-800/80 bg-[#060910] py-6 px-4 sm:px-6 text-center text-xs text-slate-400">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              BhaktiGrow AI &bull; Devotional Content Growth Platform
            </p>
            <p className="text-[11px] text-slate-400">
              Local frontend demo. No social accounts connected. Suggestions do not guarantee viral views.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
