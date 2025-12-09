'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ITicket, TicketStatus, TicketPriority, IUserResponse } from '@/types';
import { getTickets } from '@/hooks/useApi';
import { Button, Card, CardBody, Select, StatusBadge, PriorityBadge } from '@/components';

export default function AgentDashboard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agent Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Tickets</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            <p className="text-sm text-gray-500">Open</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            <p className="text-sm text-gray-500">Resolved</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            <p className="text-sm text-gray-500">Closed</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
            <p className="text-sm text-gray-500">High Priority</p>
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tickets Table */}
      {tickets.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500">No tickets found matching your filters.</p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const creator = ticket.createdBy as IUserResponse;
                  return (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {ticket.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{creator?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/agent/ticket/${ticket._id}`}>
                          <Button variant="ghost" size="sm">
                            Manage
                          </Button>
                        </Link>
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
