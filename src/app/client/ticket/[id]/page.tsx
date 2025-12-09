'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ITicket, IComment, IUserResponse } from '@/types';
import { getTicketById, getCommentsByTicket, createComment } from '@/hooks/useApi';
import { Button, Card, CardHeader, CardBody, Textarea, StatusBadge, PriorityBadge } from '@/components';

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    try {
      setIsLoading(true);
      const [ticketData, commentsData] = await Promise.all([
        getTicketById(id),
        getCommentsByTicket(id),
      ]);
      setTicket(ticketData);
      setComments(commentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ticket');
    } finally {
      setIsLoading(false);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Ticket not found'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const creator = ticket.createdBy as IUserResponse;

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        ← Back to Tickets
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
            <div className="flex gap-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Created by {creator?.name || 'Unknown'} on {new Date(ticket.createdAt).toLocaleString()}
          </div>
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
                placeholder="Add a comment..."
                className="mb-3"
              />
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!newComment.trim()}
              >
                Add Comment
              </Button>
            </form>
          )}

          {ticket.status === 'closed' && (
            <div className="mt-4 text-center text-gray-500 bg-gray-50 py-4 rounded-lg">
              This ticket is closed. No more comments can be added.
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
