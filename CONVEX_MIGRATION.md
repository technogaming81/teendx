# Convex Migration Guide

## Overview

Teendx has been successfully migrated from a traditional PostgreSQL + Express.js backend to **Convex**, a modern backend-as-a-service platform that provides:

- ✅ **Real-time database** with live queries
- ✅ **Built-in authentication** with Convex Auth
- ✅ **TypeScript-first** with full type safety
- ✅ **Automatic API generation** from functions
- ✅ **File storage** built-in
- ✅ **Real-time subscriptions** automatically
- ✅ **No backend server** to maintain

## What Changed

### Architecture Before
```
Next.js Frontend → Express API → PostgreSQL + Prisma → Redis
                ↓
          NextAuth.js (separate auth)
```

### Architecture After
```
Next.js Frontend → Convex (all-in-one)
                   ├─ Database
                   ├─ Authentication
                   ├─ Real-time subscriptions
                   └─ File storage
```

## Key Benefits

1. **Real-time by Default**: All data updates propagate instantly to all connected clients
2. **Simpler Deployment**: No separate API server, database, or Redis to manage
3. **Better DX**: Write backend functions in TypeScript alongside frontend code
4. **Type Safety**: End-to-end TypeScript with generated types
5. **Cost**: Free tier is generous, scales automatically
6. **Performance**: Built-in caching and optimistic updates

## Project Structure

```
apps/web/
├── convex/                    # Backend functions
│   ├── schema.ts             # Database schema (replaces Prisma)
│   ├── auth.ts               # Authentication config
│   ├── clients.ts            # Client CRUD functions
│   ├── users.ts              # User profile functions
│   └── _generated/           # Auto-generated types
├── app/
│   ├── ConvexClientProvider.tsx  # Convex provider
│   └── dashboard/
│       ├── page.tsx          # Uses useQuery hook
│       └── clients/page.tsx  # Uses useMutation hooks
└── .env.local                # Convex deployment config
```

## How to Use

### 1. Setup (First Time)

```bash
cd apps/web

# Install dependencies (already done)
pnpm install

# Deploy to Convex
npx convex dev

# This will:
# - Push your schema to Convex
# - Generate TypeScript types
# - Start watching for changes
```

### 2. Running Development

```bash
# From apps/web directory
pnpm dev

# This runs both:
# - Next.js dev server (port 3000)
# - Convex dev (syncs functions)
```

### 3. Writing Queries (Read Data)

```typescript
// In any React component
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MyComponent() {
  // Automatically subscribes to real-time updates!
  const clients = useQuery(api.clients.list);

  if (clients === undefined) {
    return <div>Loading...</div>;
  }

  return <div>{clients.map(...)}</div>;
}
```

### 4. Writing Mutations (Modify Data)

```typescript
// In any React component
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MyComponent() {
  const createClient = useMutation(api.clients.create);

  const handleSubmit = async (data) => {
    await createClient(data);
    // UI automatically updates via useQuery subscriptions!
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 5. Writing Backend Functions

```typescript
// convex/myFunction.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Query (read-only)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Mutation (write)
export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const clientId = await ctx.db.insert("clients", {
      userId,
      ...args,
    });

    return clientId;
  },
});
```

## Authentication

Convex Auth is integrated with support for:

- ✅ **Email/Password** (with password reset)
- ✅ **Google OAuth** (configured in Convex dashboard)
- ✅ **Automatic session management**
- ✅ **Protected routes** with `useConvexAuth()` hook

### Check Auth Status

```typescript
import { useConvexAuth } from "convex/react";

export default function MyComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome!</div>;
}
```

## Database Schema

The schema is defined in `convex/schema.ts` using Convex's schema builder:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.optional(v.string()),
    // ... more fields
  })
    .index("by_user", ["userId"]),
});
```

### Key Differences from Prisma:

| Feature | Prisma | Convex |
|---------|--------|--------|
| IDs | UUID strings | `v.id("tableName")` |
| Relations | Explicit | Query-based |
| Timestamps | Manual | `_creationTime` built-in |
| Indexes | `@@index` | `.index()` method |
| Optional | `?` | `v.optional()` |

## Deployment Configuration

The deployment is configured in `.env.local`:

```env
CONVEX_DEPLOYMENT=prod:dependable-dalmatian-854
NEXT_PUBLIC_CONVEX_URL=https://dependable-dalmatian-854.convex.cloud
```

**Production deployment:**
```bash
# Deploy to production
npx convex deploy

# This pushes functions and schema to production
```

## What Was Removed

- ❌ `apps/api/` - Express.js backend (no longer needed)
- ❌ `packages/database/` - Prisma ORM (replaced by Convex schema)
- ❌ NextAuth.js - Replaced by Convex Auth
- ❌ PostgreSQL setup - Convex has built-in database
- ❌ Redis - Convex handles caching
- ❌ Manual API routes - Convex generates them

## Migration Checklist

- [x] Convex schema created with all tables
- [x] Convex Auth configured
- [x] Client CRUD functions implemented
- [x] User profile functions implemented
- [x] Dashboard updated to use useQuery
- [x] Clients page updated to use useMutation
- [x] Authentication flow updated
- [x] Real-time subscriptions working
- [ ] Invoice functions (next step)
- [ ] Expense functions (next step)
- [ ] Project functions (next step)
- [ ] Community functions (later phase)
- [ ] File storage for receipts (later phase)

## Next Steps

1. **Implement remaining CRUD operations:**
   - Invoices (`convex/invoices.ts`)
   - Expenses (`convex/expenses.ts`)
   - Projects (`convex/projects.ts`)

2. **Add AI functions:**
   - Smart pricing suggestions
   - Tax calculations
   - Expense categorization

3. **Implement gamification:**
   - XP system
   - Badge unlocking
   - Streak tracking

4. **Add real-time features:**
   - Live notifications
   - Community feed
   - Direct messaging

## Resources

- [Convex Docs](https://docs.convex.dev)
- [Convex Auth](https://labs.convex.dev/auth)
- [Dashboard](https://dashboard.convex.dev/deployment/prod:dependable-dalmatian-854)

## Support

For Convex-specific issues:
- Convex Discord: https://convex.dev/community
- Convex Docs: https://docs.convex.dev

For Teendx development:
- Check `planning.md` for feature specifications
- Check `research.md` for codebase context
