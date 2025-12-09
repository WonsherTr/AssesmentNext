import axios from 'axios';
import {
  ITicket,
  ITicketCreate,
  ITicketUpdate,
  ITicketFilters,
  IComment,
  ICommentCreate,
  ILoginResponse,
  IApiResponse,
  IUserResponse,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth Services
export async function login(email: string, password: string): Promise<ILoginResponse> {
  const response = await api.post<IApiResponse<ILoginResponse>>('/auth/login', {
    email,
    password,
  });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Login failed');
  }
  return response.data.data;
}

export async function getMe(): Promise<IUserResponse> {
  const response = await api.get<IApiResponse<IUserResponse>>('/auth/me');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get user');
  }
  return response.data.data;
}

// Ticket Services
export async function getTickets(filters?: ITicketFilters): Promise<ITicket[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.createdBy) params.append('createdBy', filters.createdBy);
  if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);

  const response = await api.get<IApiResponse<ITicket[]>>(`/tickets?${params.toString()}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get tickets');
  }
  return response.data.data;
}

export async function getTicketById(id: string): Promise<ITicket> {
  const response = await api.get<IApiResponse<ITicket>>(`/tickets/${id}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get ticket');
  }
  return response.data.data;
}

export async function createTicket(data: ITicketCreate): Promise<ITicket> {
  const response = await api.post<IApiResponse<ITicket>>('/tickets', data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create ticket');
  }
  return response.data.data;
}

export async function updateTicket(id: string, data: ITicketUpdate): Promise<ITicket> {
  const response = await api.patch<IApiResponse<ITicket>>(`/tickets/${id}`, data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update ticket');
  }
  return response.data.data;
}

export async function deleteTicket(id: string): Promise<void> {
  const response = await api.delete<IApiResponse<null>>(`/tickets/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to delete ticket');
  }
}

// Comment Services
export async function getCommentsByTicket(ticketId: string): Promise<IComment[]> {
  const response = await api.get<IApiResponse<IComment[]>>(`/comments?ticketId=${ticketId}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get comments');
  }
  return response.data.data;
}

export async function createComment(data: ICommentCreate): Promise<IComment> {
  const response = await api.post<IApiResponse<IComment>>('/comments', data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create comment');
  }
  return response.data.data;
}

// Agent Services
export async function getAgents(): Promise<IUserResponse[]> {
  const response = await api.get<IApiResponse<IUserResponse[]>>('/users/agents');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get agents');
  }
  return response.data.data;
}

// User Services
export interface ICreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'client' | 'agent';
}

export async function createUser(data: ICreateUserData): Promise<IUserResponse> {
  const response = await api.post<{ message: string; user: IUserResponse }>('/users', data);
  return response.data.user;
}

export async function getUsers(role?: string): Promise<IUserResponse[]> {
  const params = role ? `?role=${role}` : '';
  const response = await api.get<IUserResponse[]>(`/users${params}`);
  return response.data;
}

export default api;
