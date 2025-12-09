'use client';

import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg/95 backdrop-blur-sm animate-fadeIn">
      <div className="text-center">
        {/* Logo animado */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 via-primary-500 to-teal-600 p-[2px] mb-4 shadow-lg shadow-primary-500/40">
          <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-primary-400/30 to-dark-bg/80 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-8 h-8 drop-shadow-lg animate-spin-slow" fill="none" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="loadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="9" stroke="url(#loadingGrad)" strokeWidth="1.8" fill="none" opacity="0.3" />
              <circle cx="12" cy="12" r="3.5" stroke="url(#loadingGrad)" strokeWidth="1.8" fill="none" />
              <path stroke="url(#loadingGrad)" strokeWidth="1.8" strokeLinecap="round" d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" />
            </svg>
          </div>
        </div>
        
        {/* Spinner */}
        <div className="flex justify-center mb-3">
          <div className="w-6 h-6 border-2 border-dark-border border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Mensaje */}
        <p className="text-gray-400 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
