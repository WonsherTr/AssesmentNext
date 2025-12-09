'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ITicket, IComment, IUserResponse, TicketStatus, TicketPriority } from '@/types';
import { getTicketById, getCommentsByTicket, createComment, updateTicket, getAgents } from '@/hooks/useApi';
import { Button, Card, CardHeader, CardBody, Textarea, Select, StatusBadge, PriorityBadge } from '@/components';

interface TicketManagePageProps {
  params: Promise<{ id: string }>;
}

export default function TicketManagePage({ params }: TicketManagePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [agents, setAgents] = useState<IUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for updates
  const [status, setStatus] = useState<TicketStatus>('open');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [assignedTo, setAssignedTo] = useState<string>('');

  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    try {
      setIsLoading(true);
      const [ticketData, commentsData, agentsData] = await Promise.all([
        getTicketById(id),
        getCommentsByTicket(id),
        getAgents(),
      ]);
      setTicket(ticketData);
      setComments(commentsData);
      setAgents(agentsData);

      // Set form state from ticket
      setStatus(ticketData.status);
      setPriority(ticketData.priority);
      setAssignedTo(
        typeof ticketData.assignedTo === 'string'
          ? ticketData.assignedTo
          : (ticketData.assignedTo as IUserResponse)?._id || ''
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      const updated = await updateTicket(id, {
        status,
        priority,
        assignedTo: assignedTo || null,
      });
      setTicket(updated);
      setSuccess('Ticket updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const comment = await createComment({ ticketId: id, message: newComment });
      setComments([...comments, comment]);
      setNewComment('');
      // Reload ticket to get updated status
      const updatedTicket = await getTicketById(id);
      setTicket(updatedTicket);
      setStatus(updatedTicket.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      setIsSubmitting(true);
      const updated = await updateTicket(id, { status: 'closed' });
      setTicket(updated);
      setStatus('closed');
      setSuccess('Ticket closed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const agentOptions = [
    { value: '', label: 'Unassigned' },
    ...agents.map((agent) => ({ value: agent._id, label: agent.name })),
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Ticket not found'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const creator = ticket.createdBy as IUserResponse;
  const assignedAgent = ticket.assignedTo as IUserResponse | undefined;

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        ← Back to Dashboard
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
                <div className="flex gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Created by <span className="font-medium">{creator?.name || 'Unknown'}</span> ({creator?.email}) on {new Date(ticket.createdAt).toLocaleString()}
              </div>
              {assignedAgent && (
                <div className="text-sm text-blue-600 mt-1">
                  Assigned to: <span className="font-medium">{assignedAgent.name}</span>
                </div>
              )}
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </CardBody>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h2>
            </CardHeader>
            <CardBody>
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {comments.map((comment) => {
                    const author = comment.author as IUserResponse;
                    return (
                      <div key={comment._id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{author?.name || 'Unknown'}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              author?.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {author?.role || 'user'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.message}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {ticket.status !== 'closed' && (
                <form onSubmit={handleAddComment} className="mt-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a response..."
                    className="mb-3"
                  />
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={!newComment.trim()}
                  >
                    Send Response
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar - Ticket Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Manage Ticket</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TicketStatus)}
                options={statusOptions}
              />

              <Select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                options={priorityOptions}
              />

              <Select
                label="Assign To"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                options={agentOptions}
              />

              <Button
                fullWidth
                onClick={handleUpdateTicket}
                isLoading={isSubmitting}
              >
                Update Ticket
              </Button>

              {ticket.status !== 'closed' && (
                <Button
                  fullWidth
                  variant="danger"
                  onClick={handleCloseTicket}
                  isLoading={isSubmitting}
                >
                  Close Ticket
                </Button>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Ticket Info</h2>
            </CardHeader>
            <CardBody className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated:</span>
                <span className="text-gray-900">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Comments:</span>
                <span className="text-gray-900">{comments.length}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
