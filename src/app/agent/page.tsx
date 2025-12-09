'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ITicket, TicketStatus, TicketPriority, IUserResponse } from '@/types';
import { getTickets, updateTicket } from '@/hooks/useApi';
import { Button, Card, CardBody, Select, StatusBadge, PriorityBadge } from '@/components';

export default function AgentDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [editingTicket, setEditingTicket] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<TicketStatus>('open');
  const [editPriority, setEditPriority] = useState<TicketPriority>('medium');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [statusFilter, priorityFilter]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const filters: { status?: TicketStatus; priority?: TicketPriority } = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      
      const data = await getTickets(filters);
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickEdit = (ticket: ITicket) => {
    setEditingTicket(ticket._id);
    setEditStatus(ticket.status);
    setEditPriority(ticket.priority);
  };

  const handleSaveQuickEdit = async (ticketId: string) => {
    try {
      setIsUpdating(true);
      await updateTicket(ticketId, { status: editStatus, priority: editPriority });
      setSuccess('Ticket updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setEditingTicket(null);
      loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      setIsUpdating(true);
      await updateTicket(ticketId, { status: newStatus });
      setSuccess(`Ticket status changed to ${newStatus.replace('_', ' ')}!`);
      setTimeout(() => setSuccess(''), 3000);
      loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const editStatusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const editPriorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  // Statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    highPriority: tickets.filter(t => t.priority === 'high').length,
  };

  if (isLoading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Agent Dashboard</h1>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
          <button onClick={() => setError('')} className="float-right text-red-400 hover:text-red-300">×</button>
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-gray-100">{stats.total}</p>
            <p className="text-sm text-gray-400">Total Tickets</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-primary-400">{stats.open}</p>
            <p className="text-sm text-gray-400">Open</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
            <p className="text-sm text-gray-400">In Progress</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
            <p className="text-sm text-gray-400">Resolved</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-gray-400">{stats.closed}</p>
            <p className="text-sm text-gray-400">Closed</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-red-400">{stats.highPriority}</p>
            <p className="text-sm text-gray-400">High Priority</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | '')}
            options={statusOptions}
          />
        </div>
        <div className="w-48">
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | '')}
            options={priorityOptions}
          />
        </div>
        <Button variant="secondary" onClick={() => { setStatusFilter(''); setPriorityFilter(''); }}>
          Clear Filters
        </Button>
      </div>

      {/* Tickets Table */}
      {tickets.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-400">No tickets found matching your filters.</p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-dark-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {tickets.map((ticket) => {
                  const creator = ticket.createdBy as IUserResponse;
                  const isEditing = editingTicket === ticket._id;
                  
                  return (
                    <tr 
                      key={ticket._id} 
                      className={`transition-colors ${isEditing ? 'bg-primary-500/10' : 'hover:bg-dark-card-elevated/50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-100 max-w-xs truncate">
                          {ticket.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400">{creator?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as TicketStatus)}
                            className="px-2 py-1 text-sm rounded-lg bg-dark-bg border border-dark-border text-gray-100 focus:border-primary-500 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {editStatusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={ticket.status} />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as TicketPriority)}
                            className="px-2 py-1 text-sm rounded-lg bg-dark-bg border border-dark-border text-gray-100 focus:border-primary-500 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {editPriorityOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <PriorityBadge priority={ticket.priority} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleSaveQuickEdit(ticket._id); }}
                                isLoading={isUpdating}
                              >
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); setEditingTicket(null); }}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleQuickEdit(ticket); }}
                                title="Quick Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Button>
                              <Link href={`/agent/ticket/${ticket._id}`} onClick={(e) => e.stopPropagation()}>
                                <Button variant="primary" size="sm">
                                  View
                                </Button>
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
