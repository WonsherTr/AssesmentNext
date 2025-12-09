'use client';

import React from 'react';
import { TicketStatus, TicketPriority } from '@/types';

type BadgeVariant = 'status' | 'priority' | 'custom';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  status?: TicketStatus;
  priority?: TicketPriority;
  size?: BadgeSize;
  className?: string;
}

const statusColors: Record<TicketStatus, string> = {
  open: 'bg-primary-500/15 text-primary-300 border-primary-500/40 shadow-primary-500/10',
  in_progress: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40 shadow-yellow-500/10',
  resolved: 'bg-green-500/15 text-green-300 border-green-500/40 shadow-green-500/10',
  closed: 'bg-gray-500/15 text-gray-400 border-gray-500/40 shadow-gray-500/10',
};

const statusIcons: Record<TicketStatus, string> = {
  open: '●',
  in_progress: '●',
  resolved: '✓',
  closed: '○',
};

const priorityColors: Record<TicketPriority, string> = {
  low: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
  medium: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
  high: 'bg-red-500/15 text-red-300 border-red-500/40 animate-pulse',
};

const priorityIcons: Record<TicketPriority, string> = {
  low: '↓',
  medium: '→',
  high: '↑',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function getStatusLabel(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return labels[status];
}

export function getPriorityLabel(priority: TicketPriority): string {
  const labels: Record<TicketPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return labels[priority];
}

export default function Badge({
  children,
  variant = 'custom',
  status,
  priority,
  size = 'sm',
  className = '',
}: BadgeProps) {
  let colorClasses = 'bg-gray-500/15 text-gray-300 border-gray-500/40';

  if (variant === 'status' && status) {
    colorClasses = statusColors[status];
  } else if (variant === 'priority' && priority) {
    colorClasses = priorityColors[priority];
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm
        shadow-sm transition-all duration-200
        ${colorClasses}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Helper components for common use cases
export function StatusBadge({ status, size = 'sm' }: { status: TicketStatus; size?: BadgeSize }) {
  return (
    <Badge variant="status" status={status} size={size}>
      <span className={`${status === 'in_progress' ? 'animate-pulse' : ''}`}>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
      </span>
      {getStatusLabel(status)}
    </Badge>
  );
}

export function PriorityBadge({ priority, size = 'sm' }: { priority: TicketPriority; size?: BadgeSize }) {
  return (
    <Badge variant="priority" priority={priority} size={size}>
      <span className="text-[10px]">{priorityIcons[priority]}</span>
      {getPriorityLabel(priority)}
    </Badge>
  );
}
