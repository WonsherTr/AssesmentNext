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
  open: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityColors: Record<TicketPriority, string> = {
  low: 'bg-gray-100 text-gray-700 border-gray-200',
  medium: 'bg-orange-100 text-orange-800 border-orange-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
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
  let colorClasses = 'bg-gray-100 text-gray-800 border-gray-200';

  if (variant === 'status' && status) {
    colorClasses = statusColors[status];
  } else if (variant === 'priority' && priority) {
    colorClasses = priorityColors[priority];
  }

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
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
      {getStatusLabel(status)}
    </Badge>
  );
}

export function PriorityBadge({ priority, size = 'sm' }: { priority: TicketPriority; size?: BadgeSize }) {
  return (
    <Badge variant="priority" priority={priority} size={size}>
      {getPriorityLabel(priority)}
    </Badge>
  );
}
