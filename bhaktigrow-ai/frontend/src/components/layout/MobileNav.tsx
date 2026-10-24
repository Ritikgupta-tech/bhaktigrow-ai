import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Sparkles, 
  Compass, 
  Palette, 
  BookOpen, 
  CalendarDays, 
  Bookmark, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { DiyaFlameIcon, PlatformBrandIcon } from '../devotional/DevotionalIcons';
import { useSavedItems } from '../../context/SavedItemsContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { totalSavedCount } = useSavedItems();

  if (!isOpen) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'AI Content Studio', path: '/studio', icon: <Sparkles className="w-5 h-5 text-amber-400" /> },
    { name: 'YouTube Studio', path: '/youtube', icon: <PlatformBrandIcon platform="youtube" className="w-5 h-5" /> },
    { name: 'Instagram Studio', path: '/instagram', icon: <PlatformBrandIcon platform="instagram" className="w-5 h-5" /> },
    { name: 'Facebook Studio', path: '/facebook', icon: <PlatformBrandIcon platform="facebook" className="w-5 h-5" /> },
    { name: 'Trend & Keyword Research', path: '/research', icon: <Compass className="w-5 h-5 text-cyan-400" /> },
    { name: 'Thumbnail & Hook Lab', path: '/thumbnail-lab', icon: <Palette className="w-5 h-5 text-orange-400" /> },
    { name: 'Bhakti Content Library', path: '/library', icon: <BookOpen className="w-5 h-5 text-emerald-400" /> },
    { name: 'Content Calendar', path: '/calendar', icon: <CalendarDays className="w-5 h-5 text-indigo-400" /> },
    { name: 'Saved Suggestions', path: '/saved', icon: <Bookmark className="w-5 h-5 text-amber-400" />, badge: totalSavedCount },
    { name: 'Performance Insights', path: '/analytics', icon: <BarChart3 className="w-5 h-5 text-purple-400" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 text-slate-400" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-[#090e1a] border-r border-slate-800 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center p-1.5">
                <DiyaFlameIcon className="w-full h-full" />
              </div>
              <div>
                <span className="font-bold text-base text-white">
                  Bhakti<span className="text-amber-400">Grow</span> AI
                </span>
                <p className="text-[10px] text-amber-400/80">Devotional Creator Suite</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-4 space-y-1">
            {links.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.name}</span>
                </div>
                {link.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                    {link.badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Sanatan Content Strategy</p>
          <p className="text-[11px] mt-1 text-slate-500">
            All data processed locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
