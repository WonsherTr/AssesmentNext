// User Types
export type UserRole = 'client' | 'agent';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Ticket Types
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface ITicket {
  _id: string;
  title: string;
  description: string;
  createdBy: string | IUserResponse;
  assignedTo?: string | IUserResponse;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketCreate {
  title: string;
  description: string;
  priority?: TicketPriority;
}

export interface ITicketUpdate {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string | null;
}

// Comment Types
export interface IComment {
  _id: string;
  ticketId: string;
  author: string | IUserResponse;
  message: string;
  createdAt: Date;
}

export interface ICommentCreate {
  ticketId: string;
  message: string;
}

// Auth Types
export interface IAuthContext {
  user: IUserResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ILoginResponse {
  user: IUserResponse;
  token: string;
}

// API Response Types
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Filter Types
export interface ITicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  createdBy?: string;
  assignedTo?: string;
}
