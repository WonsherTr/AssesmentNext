'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glow?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  onClick,
  hoverable = false,
  glow = false
}: CardProps) {
  return (
    <div
      className={`
        bg-dark-card
        backdrop-blur-sm
        rounded-xl border border-dark-border
        shadow-lg shadow-black/30
        ${hoverable ? 'hover:shadow-xl hover:shadow-primary-500/20 hover:border-primary-500/50 hover:-translate-y-0.5 cursor-pointer hover:bg-dark-card-elevated' : ''}
        ${glow ? 'glow-cyan-sm' : ''}
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-5 border-b border-dark-border/50 ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-dark-border/50 bg-dark-card-elevated/30 rounded-b-xl ${className}`}>
      {children}
    </div>
  );
}
