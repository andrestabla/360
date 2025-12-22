# Maturity 360

## Overview
Maturity 360 is an organizational maturity management platform built with Next.js. It provides tools for managing organizational processes, documents, workflows, and team communication.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Phosphor Icons
- **PDF Handling**: react-pdf

## Project Structure
```
/app                 # Next.js App Router pages
  /admin             # Super admin pages
  /auth              # Authentication pages
  /dashboard         # Main dashboard and features
  /features          # Features landing page
  /login             # Login page
  /pricing           # Pricing page
/components          # Reusable React components
  /chat              # Chat feature components
  /landing           # Landing page components
  /onboarding        # User onboarding components
/context             # React context providers
/lib                 # Core library files
  /services          # Service layer (chat, storage)
  /templates         # Survey templates
/public              # Static assets
```

## Key Features
- Multi-tenant architecture with organization management
- User management with role-based access control
- Document repository with version control
- Workflow automation
- Real-time chat
- Surveys and diagnostics
- Analytics dashboard

## Running the Application
The development server runs on port 5000:
```bash
npm run dev -- -H 0.0.0.0 -p 5000
```

## Data Layer
The application uses PostgreSQL database with Drizzle ORM. Key entities include:
- Tenants (organizations)
- Users
- Units (organizational structure)
- Documents
- Conversations/Messages
- Workflows
- Surveys
- Audit Logs

### Database Commands
```bash
npm run db:push    # Push schema changes to database
npm run db:studio  # Open Drizzle Studio for database management
```

### Database Schema
The schema is defined in `shared/schema.ts` using Drizzle ORM. The database connection is configured in `server/db.ts`.

**Note:** The app also maintains a mock in-memory database (`lib/data.ts`) with localStorage persistence for demo/prototype features.

## Configuration
- `next.config.ts`: Next.js configuration with allowed dev origins for Replit environment
- `tsconfig.json`: TypeScript configuration with path aliases (@/*)

## Domain Architecture
- **Production Domain**: maturity.online
- **Main Domain**: maturity.online - Shows landing page with tenant finder
- **Tenant Access**: Via path-based routing `/tenant/{slug}` (no DNS configuration required)
  - Example: maturity.online/tenant/demo, maturity.online/tenant/alpha
- Domain configuration managed in `lib/config.ts`

### Multi-Tenant Routing
- Path-based routing: `/tenant/[slug]` routes to tenant-specific login
- Each tenant has: `id` (internal), `slug` (URL path), `domains` (full domain list)
- Sample tenants: `demo` (T1), `alpha` (T2)
- After login, users are redirected to the shared `/dashboard` with tenant context stored in session

## Authentication
- **Superadmin credentials**: superadmin@maturity.online / Admin2024!
- Session persistence with localStorage (synchronized hydration to prevent logout on refresh)
- Tenant users authenticate through their subdomain

## Email Notifications (Gmail Integration)
- System notifications are sent via the connected Gmail account
- Email service: `lib/services/emailService.ts`
- API endpoint: `POST /api/notifications/send`
- Supports general notifications and workflow-specific notifications
- Uses Google APIs with OAuth2 authentication via Replit's connector system

## Recent Changes
- December 2024: Imported from GitHub and configured for Replit environment
- Added missing library files (data.ts, chatService.ts, i18n.ts, etc.)
- Configured allowedDevOrigins for Replit proxy compatibility
- December 22, 2025: Completed TypeScript type fixes for full build compatibility
  - Extended User interface with 'PENDING_INVITE' status
  - Extended Post interface with 'article' mediaType and publicComments
  - Extended ChatMessage with deleted_at, edited_at, reactions, attachments, reply support
  - Extended Conversation with avatar, last_message_at, lastMessagePreview
  - Extended WorkNote with status, date, isImportant properties
  - Added ConversationMember interface and conversationMembers to database
  - Fixed ChatService method signatures (muteConversation, updateNotificationSettings, reportContent)
  - Fixed mime_type null checks in attachment rendering
  - Created types/chat.ts for centralized chat type exports
- December 22, 2025: Domain and login configuration
  - Migrated domain from localhost:3000 to maturity.online
  - Main domain shows superadmin login only (no tenant finder form)
  - Fixed session persistence (synchronous localStorage hydration)
  - Improved subdomain detection for maturity.online
