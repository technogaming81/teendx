import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Convex schema for Teendx
export default defineSchema({
  // Auth tables from @convex-dev/auth
  ...authTables,

  // User profile and gamification data
  users: defineTable({
    // Auth integration
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),

    // Gamification
    level: v.number(),
    xp: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActivityDate: v.optional(v.number()),

    // Subscription
    subscriptionTier: v.string(), // "free" | "pro"
    subscriptionEnds: v.optional(v.number()),

    // Business Settings
    businessName: v.optional(v.string()),
    businessLogo: v.optional(v.string()),
    gstNumber: v.optional(v.string()),
    panNumber: v.optional(v.string()),

    // Preferences
    theme: v.string(), // "light" | "dark"
    language: v.string(),
    compactMode: v.boolean(),
  })
    .index("by_email", ["email"]),

  // Clients
  clients: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    gstNumber: v.optional(v.string()),

    // Address
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    pincode: v.optional(v.string()),
    country: v.string(),

    // Business Data
    notes: v.optional(v.string()),
    tags: v.array(v.string()),
    healthScore: v.optional(v.number()),
    acquisitionSource: v.optional(v.string()),

    // Financials (stored as numbers, display as currency)
    totalPaid: v.number(),
    totalDue: v.number(),
    lifetimeValue: v.number(),

    lastContactDate: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_name", ["userId", "name"]),

  // Invoices
  invoices: defineTable({
    invoiceNumber: v.string(),
    userId: v.id("users"),
    clientId: v.id("clients"),

    // Invoice Details
    status: v.string(), // "draft" | "sent" | "paid" | "partially_paid" | "overdue" | "cancelled"
    amount: v.number(),
    taxAmount: v.number(),
    totalAmount: v.number(),
    currency: v.string(),

    // Dates (stored as timestamps)
    issueDate: v.number(),
    dueDate: v.number(),
    paidDate: v.optional(v.number()),

    // Payment
    paymentMethod: v.optional(v.string()),
    paymentLinkId: v.optional(v.string()),
    paymentQRCode: v.optional(v.string()),
    razorpayOrderId: v.optional(v.string()),
    razorpayPaymentId: v.optional(v.string()),

    // Content
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
    terms: v.optional(v.string()),

    // Files (stored as Convex file IDs)
    pdfFileId: v.optional(v.id("_storage")),

    // Tracking
    sentAt: v.optional(v.number()),
    viewedAt: v.optional(v.number()),
    remindersSent: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_invoice_number", ["invoiceNumber"])
    .index("by_user_and_status", ["userId", "status"]),

  // Invoice Items
  invoiceItems: defineTable({
    invoiceId: v.id("invoices"),
    description: v.string(),
    quantity: v.number(),
    rate: v.number(),
    amount: v.number(),
    taxRate: v.number(),
  })
    .index("by_invoice", ["invoiceId"]),

  // Payments
  payments: defineTable({
    invoiceId: v.id("invoices"),
    amount: v.number(),
    paymentMethod: v.string(),
    paymentGateway: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    status: v.string(), // "pending" | "success" | "failed"
    paidAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_invoice", ["invoiceId"]),

  // Expenses
  expenses: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    category: v.string(),
    description: v.string(),
    date: v.number(),
    paymentMethod: v.optional(v.string()),
    receiptFileId: v.optional(v.id("_storage")),
    isTaxDeductible: v.boolean(),
    tags: v.array(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"])
    .index("by_user_and_category", ["userId", "category"]),

  // Projects
  projects: defineTable({
    userId: v.id("users"),
    clientId: v.optional(v.id("clients")),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "active" | "completed" | "cancelled"
    estimatedValue: v.optional(v.number()),
    actualValue: v.optional(v.number()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    progressPercent: v.number(),
    estimatedHours: v.optional(v.number()),
    actualHours: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"]),

  // Milestones
  milestones: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_project", ["projectId"]),

  // Time Entries
  timeEntries: defineTable({
    projectId: v.id("projects"),
    description: v.optional(v.string()),
    hours: v.number(),
    date: v.number(),
  })
    .index("by_project", ["projectId"]),

  // Gamification: Badges
  badges: defineTable({
    name: v.string(),
    description: v.string(),
    iconUrl: v.string(),
    category: v.string(),
    xpReward: v.number(),
    criteria: v.any(), // JSON object
  }),

  // Gamification: User Badges
  userBadges: defineTable({
    userId: v.id("users"),
    badgeId: v.id("badges"),
    unlockedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_badge", ["userId", "badgeId"]),

  // Gamification: Goals
  goals: defineTable({
    userId: v.id("users"),
    type: v.string(), // "income" | "clients" | "projects" | "savings"
    targetValue: v.number(),
    currentValue: v.number(),
    period: v.string(), // "weekly" | "monthly" | "quarterly" | "yearly"
    startDate: v.number(),
    endDate: v.number(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_period", ["userId", "period"]),

  // Gamification: Daily Challenges
  dailyChallenges: defineTable({
    title: v.string(),
    description: v.string(),
    xpReward: v.number(),
    type: v.string(),
    target: v.number(),
    date: v.string(), // YYYY-MM-DD format
  })
    .index("by_date", ["date"]),

  // Gamification: User Challenge Completions
  userChallengeCompletions: defineTable({
    userId: v.id("users"),
    challengeId: v.id("dailyChallenges"),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_challenge", ["userId", "challengeId"]),

  // Activity Logs (for streak tracking and XP)
  activityLogs: defineTable({
    userId: v.id("users"),
    activityType: v.string(),
    metadata: v.optional(v.any()),
    xpEarned: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_time", ["userId", "_creationTime"]),

  // Community: Posts
  communityPosts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    channel: v.string(), // "wins" | "questions" | "collaborate" | "tips"
    likesCount: v.number(),
    commentsCount: v.number(),
    isAnonymous: v.boolean(),
    status: v.string(), // "published" | "flagged" | "removed"
    mediaUrls: v.array(v.string()),
  })
    .index("by_channel", ["channel"])
    .index("by_user", ["userId"])
    .index("by_channel_and_time", ["channel", "_creationTime"]),

  // Community: Comments
  communityComments: defineTable({
    postId: v.id("communityPosts"),
    userId: v.id("users"),
    content: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"]),

  // Community: Likes
  communityLikes: defineTable({
    postId: v.id("communityPosts"),
    userId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_and_user", ["postId", "userId"]),

  // Messages (Direct Messaging)
  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    read: v.boolean(),
    readAt: v.optional(v.number()),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_conversation", ["senderId", "receiverId"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    readAt: v.optional(v.number()),
    actionUrl: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "read"]),

  // AI: Pricing Suggestions (cached)
  pricingSuggestions: defineTable({
    serviceType: v.string(),
    location: v.string(),
    experienceLevel: v.string(),
    minPrice: v.number(),
    maxPrice: v.number(),
    confidence: v.number(),
    dataPoints: v.number(),
  })
    .index("by_service_and_location", ["serviceType", "location"]),

  // Tax Estimates
  taxEstimates: defineTable({
    userId: v.id("users"),
    financialYear: v.string(),
    quarter: v.optional(v.string()),
    totalIncome: v.number(),
    totalExpenses: v.number(),
    taxableIncome: v.number(),
    estimatedTax: v.number(),
    tdsDeducted: v.number(),
    calculatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_year", ["userId", "financialYear"]),
});
