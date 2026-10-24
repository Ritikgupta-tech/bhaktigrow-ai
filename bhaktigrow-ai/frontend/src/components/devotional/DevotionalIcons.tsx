import React from 'react';

export const DiyaFlameIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="flameGrad" x1="24" y1="4" x2="24" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="25%" stopColor="#fde047" />
        <stop offset="65%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
      <linearGradient id="clayGrad" x1="6" y1="28" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>
    {/* Diya Flame */}
    <path
      d="M24 6 C28 14, 32 20, 30 26 C28 32, 20 32, 18 26 C16 20, 20 14, 24 6 Z"
      fill="url(#flameGrad)"
      filter="drop-shadow(0px 0px 6px rgba(245, 158, 11, 0.6))"
    />
    <circle cx="24" cy="24" r="3" fill="#ffffff" opacity="0.8" />
    {/* Earthen Bowl */}
    <path
      d="M6 30 C12 43, 36 43, 42 30 C34 35, 14 35, 6 30 Z"
      fill="url(#clayGrad)"
    />
    <ellipse cx="24" cy="29.5" rx="16" ry="2.5" fill="#fcd34d" opacity="0.6" />
  </svg>
);

export const LotusIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="lotusGrad" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c026d3" />
      </linearGradient>
    </defs>
    {/* Central Petal */}
    <path
      d="M32 12 C36 24, 40 36, 32 50 C24 36, 28 24, 32 12 Z"
      fill="url(#lotusGrad)"
      opacity="0.95"
    />
    {/* Left Petal */}
    <path
      d="M32 24 C22 26, 12 36, 18 46 C24 48, 30 46, 32 40 Z"
      fill="url(#lotusGrad)"
      opacity="0.85"
    />
    {/* Right Petal */}
    <path
      d="M32 24 C42 26, 52 36, 46 46 C40 48, 34 46, 32 40 Z"
      fill="url(#lotusGrad)"
      opacity="0.85"
    />
    {/* Outer Base Petals */}
    <path
      d="M18 46 C10 40, 6 48, 14 54 C20 54, 28 50, 32 48 Z"
      fill="url(#lotusGrad)"
      opacity="0.65"
    />
    <path
      d="M46 46 C54 40, 58 48, 50 54 C44 54, 36 50, 32 48 Z"
      fill="url(#lotusGrad)"
      opacity="0.65"
    />
  </svg>
);

export const SacredMandalaSVG: React.FC<{ className?: string }> = ({ className = 'w-64 h-64' }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="100" cy="100" r="90" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
    <circle cx="100" cy="100" r="75" stroke="#f97316" strokeWidth="1.5" opacity="0.4" />
    <circle cx="100" cy="100" r="50" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
    <circle cx="100" cy="100" r="25" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
    {/* 8-Petal Geometry */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 100 100)`}>
        <path
          d="M100 25 C108 50, 115 70, 100 90 C85 70, 92 50, 100 25 Z"
          stroke="#f59e0b"
          strokeWidth="1.2"
          fill="rgba(245, 158, 11, 0.05)"
        />
        <circle cx="100" cy="20" r="2" fill="#fbbf24" />
      </g>
    ))}
    <circle cx="100" cy="100" r="6" fill="#f59e0b" opacity="0.9" />
  </svg>
);

export const PlatformBrandIcon: React.FC<{ platform: 'youtube' | 'instagram' | 'facebook'; className?: string }> = ({
  platform,
  className = 'w-5 h-5'
}) => {
  if (platform === 'youtube') {
    return (
      <span className={`inline-flex items-center justify-center rounded-lg bg-red-600/15 text-red-500 border border-red-500/30 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </span>
    );
  }

  if (platform === 'instagram') {
    return (
      <span className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-600/20 text-pink-400 border border-pink-500/30 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </span>
    );
  }

  // Facebook
  return (
    <span className={`inline-flex items-center justify-center rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/30 ${className}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </span>
  );
};
