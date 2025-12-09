# HelpDeskPro - Ticket Management System

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)

## 📋 Description

HelpDeskPro is a comprehensive ticket management system built with Next.js 14, TypeScript, and MongoDB. It enables efficient management of support tickets with role-based access control for clients and agents.

### Key Features

- ✅ **Role-based Authentication** (Client/Agent)
- ✅ **Ticket Management** with status and priority tracking
- ✅ **Comment System** for ticket discussions
- ✅ **Email Notifications** for ticket events
- ✅ **Agent Dashboard** with filters and statistics
- ✅ **Client Portal** for ticket submission and tracking
- ✅ **Cron Job** for reminder emails on stale tickets
- ✅ **Reusable UI Components** (Button, Badge, Card)

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | Full-stack React framework with App Router |
| TypeScript | Type-safe development |
| MongoDB + Mongoose | Database and ODM |
| Tailwind CSS | Styling |
| JWT + bcryptjs | Authentication |
| Nodemailer | Email notifications |
| Axios | HTTP client |

## 📁 Project Structure

```
/src
  /app                    # Next.js App Router pages
    /api                  # API routes
      /auth              # Authentication endpoints (login, me)
      /tickets           # Ticket CRUD operations
      /comments          # Comment operations
      /users             # User operations (list agents)
      /cron              # Cron job endpoints (reminders)
    /client              # Client dashboard & pages
    /agent               # Agent dashboard & pages
    /login               # Login page
  /components            # Reusable UI components
    /ui                  # Button, Badge, Card, Input, etc.
  /context               # React Context providers (AuthContext)
  /lib                   # Utilities, DB connection, email service
  /models                # Mongoose models (User, Ticket, Comment)
  /services              # Axios service functions
  /types                 # TypeScript interfaces
  /scripts               # Database seed scripts
```

## 🔧 Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **SMTP Server** for email notifications (Gmail, SendGrid, etc.)

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/helpdesk-pro.git
cd helpdesk-pro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/helpdesk

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# SMTP Configuration for Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# (Optional) Cron Secret for securing cron endpoints
CRON_SECRET=your-cron-secret
```

### 4. Seed the database

Run the seed script to create demo users and sample data:

```bash
npm run seed
```

This creates:
- **Client accounts:** `client@helpdesk.com` / `client123`
- **Agent accounts:** `agent@helpdesk.com` / `agent123`
- Sample tickets and comments

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Client | client@helpdesk.com | client123 |
| Agent | agent@helpdesk.com | agent123 |

## 📸 Screenshots

### Login Page
The login page allows users to authenticate with email and password. Based on their role, they are redirected to the appropriate dashboard.

### Client Dashboard
Clients can view their tickets, create new tickets, and add comments to existing tickets.

### Agent Dashboard
Agents have access to all tickets with filtering capabilities by status and priority. They can manage tickets, update status/priority, assign agents, and respond to clients.

### Ticket Detail View
Both clients and agents can view ticket details and participate in the comment thread.

## 🔄 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List tickets (with filters) |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/[id]` | Get ticket by ID |
| PATCH | `/api/tickets/[id]` | Update ticket |
| DELETE | `/api/tickets/[id]` | Delete ticket (agents only) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments?ticketId=xxx` | Get comments for ticket |
| POST | `/api/comments` | Add comment to ticket |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/agents` | List all agents (agents only) |

### Cron Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cron/reminder` | Send reminder emails for stale tickets |

## 📧 Email Notifications

The system sends automated emails for:
- ✉️ **Ticket Created** - Client receives confirmation
- ✉️ **New Response** - Client notified when agent responds
- ✉️ **Ticket Closed** - Client notified when ticket is closed
- ✉️ **Reminder** - Agents notified of stale tickets (via cron)

## ⏰ Cron Job Setup

To set up automatic reminders for stale tickets:

### Using Vercel Cron (Recommended for Vercel deployments)

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/reminder",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Using external cron service

Call the endpoint with authentication:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/reminder
```

## 🧪 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with demo data |

## 📋 User Stories Implemented

### For Clients
- ✅ Register and authenticate
- ✅ Create support tickets with title, description, and priority
- ✅ View list of own tickets
- ✅ View ticket details and comment history
- ✅ Add comments to own tickets
- ✅ Receive email notifications

### For Agents
- ✅ Authenticate with agent role
- ✅ View all tickets with filters (status, priority)
- ✅ Update ticket status (open, in_progress, resolved, closed)
- ✅ Update ticket priority
- ✅ Assign tickets to agents
- ✅ Respond to tickets with comments
- ✅ Close tickets
- ✅ View dashboard with statistics
- ✅ Receive reminder emails for stale tickets

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Protected API routes
- Role-based access control
- CORS protection
- Input validation

## 🎨 UI Components

The project includes reusable, typed UI components:

- **Button** - Multiple variants (primary, secondary, success, danger, warning, ghost) and sizes
- **Badge** - For status and priority display
- **Card** - Container with header, body, and footer sections
- **Input/Textarea/Select** - Form components with validation states

## 👤 Coder Information

| Field | Value |
|-------|-------|
| **Name** | [Your Name] |
| **Clan** | [Your Clan] |
| **Email** | [your.email@example.com] |
| **Document ID** | [Your ID Number] |

---

## 📄 License

This project is created for educational purposes as part of a coding assessment.

---

Made with ❤️ using Next.js, TypeScript, and MongoDB
