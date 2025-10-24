# Teendx - Business Operating System for Teen Freelancers

A comprehensive, mobile-first platform empowering Indian teenage freelancers (ages 15-21) to manage their businesses professionally.

## Features

- **Client Management**: Full CRUD operations with health scores and analytics
- **Invoice Management**: Create, send, and track professional invoices with PDF export
- **Payment Integration**: Razorpay integration with UPI, cards, and payment links
- **Expense Tracking**: AI-powered categorization with receipt scanning
- **Project Management**: Track projects, milestones, and time entries
- **Gamification**: XP system, streaks, badges, and leaderboards
- **AI Co-Pilot**: Smart pricing, tax optimization, and automated insights
- **Community Hub**: Connect with peers, share wins, and collaborate
- **Tax Assistant**: Real-time tax calculations and ITR filing guides

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Hooks
- **Authentication**: NextAuth.js v5

### Backend
- **API**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Authentication**: JWT + NextAuth
- **File Storage**: AWS S3

### AI/ML
- **AI Provider**: Google Gemini API
- **Features**: Pricing suggestions, expense categorization, tax optimization

### Infrastructure
- **Monorepo**: Turborepo with pnpm workspaces
- **Frontend Hosting**: Vercel
- **Backend Hosting**: AWS ECS
- **Database**: AWS RDS (PostgreSQL)
- **CDN**: CloudFront

## Project Structure

```
teendx/
├── apps/
│   ├── web/              # Next.js frontend (PWA)
│   ├── api/              # Express.js backend API
│   └── ai-service/       # Python/Node.js ML service
├── packages/
│   ├── database/         # Prisma schema and client
│   ├── shared-types/     # Shared TypeScript types
│   ├── ui/               # Shared React components
│   └── config/           # Shared configs (ESLint, TS, etc.)
└── docs/                 # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 6

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/teendx.git
cd teendx
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed initial data
```

5. Start development servers:
```bash
pnpm dev  # Starts all apps concurrently
```

- Frontend: http://localhost:3000
- API: http://localhost:4000

### Database Management

```bash
# Generate Prisma client
pnpm db:generate

# Create a new migration
pnpm db:migrate

# Push schema without migration (dev only)
pnpm db:push

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

## Development

### Running Individual Apps

```bash
# Frontend only
cd apps/web
pnpm dev

# API only
cd apps/api
pnpm dev
```

### Building for Production

```bash
# Build all apps
pnpm build

# Build specific app
cd apps/web
pnpm build
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/:id` - Get client details
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/payment-link` - Generate payment link
- `POST /api/invoices/:id/mark-paid` - Mark as paid manually

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token signing
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: Razorpay credentials
- `GEMINI_API_KEY`: Google Gemini API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Contact

For questions or support, contact: support@teendx.in
