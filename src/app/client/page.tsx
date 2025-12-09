'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ITicket } from '@/types';
import { getTickets } from '@/hooks/useApi';
import { Button, Card, CardBody, StatusBadge, PriorityBadge } from '@/components';

export default function ClientDashboard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-dark-border border-t-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">My Tickets</h1>
          <p className="text-gray-400 mt-1">Track and manage your support requests</p>
        </div>
        <Link href="/client/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 mb-6">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center glow-cyan-sm">
          <div className="w-16 h-16 rounded-2xl bg-dark-card mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">No tickets yet</h3>
          <p className="text-gray-400 mb-6">Create your first support ticket to get started</p>
          <Link href="/client/new">
            <Button>Create Your First Ticket</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Link key={ticket._id} href={`/client/ticket/${ticket._id}`}>
              <Card hoverable className="h-full group">
                <CardBody className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-100 line-clamp-1 group-hover:text-primary-400 transition-colors">{ticket.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">{ticket.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-dark-border/30">
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-primary-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Details
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
