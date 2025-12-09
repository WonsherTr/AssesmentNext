'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card, CardHeader, CardBody } from '@/components';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      await login(email, password);
      // Redirect will be handled by the page.tsx based on role
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">HelpDeskPro</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                size="lg"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-sm text-gray-500">
                <p><span className="font-medium">Client:</span> client@helpdesk.com / client123</p>
                <p><span className="font-medium">Agent:</span> agent@helpdesk.com / agent123</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
