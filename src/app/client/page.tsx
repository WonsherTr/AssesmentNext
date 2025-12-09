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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        <Link href="/client/new">
          <Button>Create New Ticket</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500 mb-4">You don&apos;t have any tickets yet.</p>
            <Link href="/client/new">
              <Button>Create Your First Ticket</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Card key={ticket._id} hoverable>
              <CardBody>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{ticket.title}</h3>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{ticket.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/client/ticket/${ticket._id}`}>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
