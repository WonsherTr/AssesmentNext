'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicket } from '@/hooks/useApi';
import { TicketPriority } from '@/types';
import { Button, Input, Textarea, Select, Card, CardHeader, CardBody } from '@/components';

export default function NewTicketPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description) {
      setError('Title and description are required');
      return;
    }

    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (description.length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }

    try {
      setIsLoading(true);
      await createTicket({ title, description, priority });
      setSuccess('Ticket created successfully!');
      setTimeout(() => router.push('/client'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Ticket</h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Ticket Details</h2>
          <p className="text-sm text-gray-500">Describe your issue or request</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your issue"
              required
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about your issue..."
              required
            />

            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              options={priorityOptions}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
              >
                Create Ticket
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
