import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Compass, 
  Palette, 
  BookOpen, 
  CalendarDays, 
  Bookmark, 
  BarChart3, 
  Settings,
  ChevronRight,
  Flame
} from 'lucide-react';
import { DiyaFlameIcon, PlatformBrandIcon } from '../devotional/DevotionalIcons';
import { useSavedItems } from '../../context/SavedItemsContext';

export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
  section?: 'main' | 'studios' | 'tools' | 'system';
}

export const Sidebar: React.FC<{ collapsed?: boolean; onToggle?: () => void }> = ({
  collapsed = false
}) => {
  const { totalSavedCount } = useSavedItems();

  const navigation: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, section: 'main' },
    { name: 'AI Content Studio', path: '/studio', icon: <Sparkles className="w-5 h-5 text-amber-400" />, section: 'main' },
    
    // Studios
    { name: 'YouTube Studio', path: '/youtube', icon: <PlatformBrandIcon platform="youtube" className="w-5 h-5" />, section: 'studios' },
    { name: 'Instagram Studio', path: '/instagram', icon: <PlatformBrandIcon platform="instagram" className="w-5 h-5" />, section: 'studios' },
    { name: 'Facebook Studio', path: '/facebook', icon: <PlatformBrandIcon platform="facebook" className="w-5 h-5" />, section: 'studios' },
    
    // Growth & Creative Tools
    { name: 'Trend Research', path: '/research', icon: <Compass className="w-5 h-5 text-cyan-400" />, section: 'tools' },
    { name: 'Thumbnail & Hook Lab', path: '/thumbnail-lab', icon: <Palette className="w-5 h-5 text-orange-400" />, section: 'tools' },
    { name: 'Bhakti Content Library', path: '/library', icon: <BookOpen className="w-5 h-5 text-emerald-400" />, section: 'tools' },
    { name: 'Content Calendar', path: '/calendar', icon: <CalendarDays className="w-5 h-5 text-indigo-400" />, section: 'tools' },
    { name: 'Saved Suggestions', path: '/saved', icon: <Bookmark className="w-5 h-5 text-amber-400" />, badge: totalSavedCount > 0 ? totalSavedCount : undefined, section: 'tools' },
    
    // System
    { name: 'Performance Insights', path: '/analytics', icon: <BarChart3 className="w-5 h-5 text-purple-400" />, section: 'system' },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 text-slate-400" />, section: 'system' }
  ];

  return (
    <aside 
      className={`hidden lg:flex flex-col border-r border-slate-800/80 bg-[#090e1a]/95 backdrop-blur-xl h-screen sticky top-0 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <DiyaFlameIcon className="w-full h-full" />
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-sans">
                  Bhakti<span className="text-amber-400">Grow</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-amber-300/70 font-medium">Devotional Growth Platform</p>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Studio &amp; Core
            </p>
          )}
          {navigation.filter(item => item.section === 'main').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Dedicated Social Studios */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Social Studios (5 Ideas Each)
            </p>
          )}
          {navigation.filter(item => item.section === 'studios').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
            </NavLink>
          ))}
        </div>

        {/* Growth & Creative Tools */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Growth &amp; Planning
            </p>
          )}
          {navigation.filter(item => item.section === 'tools').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* System & Analytics */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              System
            </p>
          )}
          {navigation.filter(item => item.section === 'system').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer Pill */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Sanatan Devotional AI</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Local strategy generator. Stays 100% private in browser.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
