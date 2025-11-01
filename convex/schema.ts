import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Teendex Database Schema
 * Comprehensive schema for gamified CRM platform for Gen Z freelancers
 */

export default defineSchema({
  // ==================== USER MANAGEMENT ====================

  /**
   * User Profiles - Extended user information beyond auth
   */
  userProfiles: defineTable({
    userId: v.string(), // Reference to Convex Auth user ID
    displayName: v.string(),
    avatar: v.optional(v.string()), // Convex file storage ID
    age: v.number(),
    role: v.string(), // e.g., "Graphic Designer", "Developer"
    location: v.string(), // City name
    skills: v.array(v.string()),
    bio: v.optional(v.string()),
    isOnboarded: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  /**
   * User Preferences - Settings and preferences
   */
  userPreferences: defineTable({
    userId: v.string(),
    theme: v.union(v.literal("light"), v.literal("dark")),
    emailNotifications: v.boolean(),
    pushNotifications: v.boolean(),
    language: v.string(),
    currency: v.string(),
    timezone: v.string(),
  }).index("by_user", ["userId"]),

  // ==================== GAMIFICATION ====================

  /**
   * Gamification Stats - User XP, levels, streaks
   */
  gamificationStats: defineTable({
    userId: v.string(),
    xp: v.number(),
    level: v.number(),
    totalEarnings: v.number(), // in paise (1/100 rupee)
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.number(),
    weeklyStreak: v.number(),
    totalBadges: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_xp", ["xp"])
    .index("by_level", ["level"]),

  /**
   * Achievements - Badge definitions
   */
  achievements: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("revenue"),
      v.literal("activity"),
      v.literal("social"),
      v.literal("milestone")
    ),
    rarity: v.union(
      v.literal("common"),
      v.literal("rare"),
      v.literal("epic"),
      v.literal("legendary")
    ),
    icon: v.string(),
    xpReward: v.number(),
    unlockCondition: v.object({
      type: v.string(),
      value: v.any(),
    }),
    isHidden: v.boolean(),
  }).index("by_category", ["category"]),

  /**
   * User Achievements - Badges earned by users
   */
  userAchievements: defineTable({
    userId: v.string(),
    achievementId: v.id("achievements"),
    unlockedAt: v.number(),
    displayOrder: v.number(),
    isShowcased: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_user_achievement", ["userId", "achievementId"]),

  /**
   * Challenges - Daily/weekly challenges
   */
  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("special")
    ),
    category: v.string(),
    xpReward: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    condition: v.object({
      type: v.string(),
      target: v.number(),
    }),
    participantCount: v.number(),
    completionCount: v.number(),
  }).index("by_type", ["type"])
    .index("by_date_range", ["startDate", "endDate"]),

  /**
   * User Challenges - User participation in challenges
   */
  userChallenges: defineTable({
    userId: v.string(),
    challengeId: v.id("challenges"),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("expired")
    ),
    progress: v.number(),
    acceptedAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_user_challenge", ["userId", "challengeId"]),

  // ==================== CLIENT MANAGEMENT ====================

  /**
   * Clients - Client/customer records
   */
  clients: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    tags: v.array(v.string()),
    source: v.string(),
    healthScore: v.number(), // 0-100
    notes: v.string(),
    totalRevenue: v.number(), // in paise
    projectCount: v.number(),
    lastContactDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_name", ["userId", "name"])
    .index("by_health", ["healthScore"]),

  // ==================== PROJECT MANAGEMENT ====================

  /**
   * Projects - Project records
   */
  projects: defineTable({
    userId: v.string(),
    clientId: v.id("clients"),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    budget: v.number(), // in paise
    actualCost: v.number(), // in paise
    estimatedHours: v.optional(v.number()),
    actualHours: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    completionDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"]),

  /**
   * Project Milestones - Milestones within projects
   */
  projectMilestones: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(v.literal("pending"), v.literal("completed")),
    order: v.number(),
  }).index("by_project", ["projectId"]),

  /**
   * Time Entries - Time tracking for projects
   */
  timeEntries: defineTable({
    userId: v.string(),
    projectId: v.id("projects"),
    description: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()), // null if timer is running
    duration: v.number(), // in minutes
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_user_project", ["userId", "projectId"]),

  // ==================== INVOICING & PAYMENTS ====================

  /**
   * Invoices - Invoice records
   */
  invoices: defineTable({
    userId: v.string(),
    clientId: v.id("clients"),
    projectId: v.optional(v.id("projects")),
    invoiceNumber: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    currency: v.string(),
    subtotal: v.number(), // in paise
    tax: v.number(), // in paise
    taxRate: v.number(), // percentage
    total: v.number(), // in paise
    dueDate: v.number(),
    sentDate: v.optional(v.number()),
    paidDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    pdfUrl: v.optional(v.string()), // Convex file storage ID
    viewCount: v.number(),
    isRecurring: v.boolean(),
    recurringInterval: v.optional(
      v.union(v.literal("monthly"), v.literal("quarterly"), v.literal("yearly"))
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"])
    .index("by_invoice_number", ["invoiceNumber"]),

  /**
   * Invoice Items - Line items in invoices
   */
  invoiceItems: defineTable({
    invoiceId: v.id("invoices"),
    description: v.string(),
    quantity: v.number(),
    unitPrice: v.number(), // in paise
    amount: v.number(), // in paise
    order: v.number(),
  }).index("by_invoice", ["invoiceId"]),

  /**
   * Payments - Payment records for invoices
   */
  payments: defineTable({
    invoiceId: v.id("invoices"),
    amount: v.number(), // in paise
    paymentDate: v.number(),
    paymentMethod: v.union(
      v.literal("bank_transfer"),
      v.literal("upi"),
      v.literal("cash"),
      v.literal("check"),
      v.literal("other")
    ),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_invoice", ["invoiceId"]),

  // ==================== EXPENSE MANAGEMENT ====================

  /**
   * Expenses - Business expense records
   */
  expenses: defineTable({
    userId: v.string(),
    category: v.string(),
    vendor: v.string(),
    amount: v.number(), // in paise
    currency: v.string(),
    date: v.number(),
    description: v.string(),
    receiptUrl: v.optional(v.string()), // Convex file storage ID
    isTaxDeductible: v.boolean(),
    notes: v.optional(v.string()),
    isAiCategorized: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_category", ["category"])
    .index("by_user_date", ["userId", "date"]),

  // ==================== GOAL MANAGEMENT ====================

  /**
   * Goals - User business goals
   */
  goals: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("revenue"),
      v.literal("clients"),
      v.literal("projects"),
      v.literal("skills"),
      v.literal("custom")
    ),
    targetValue: v.number(),
    currentValue: v.number(),
    unit: v.string(),
    startDate: v.number(),
    targetDate: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("abandoned")
    ),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"]),

  /**
   * Goal Milestones - Milestones within goals
   */
  goalMilestones: defineTable({
    goalId: v.id("goals"),
    title: v.string(),
    value: v.number(),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
    order: v.number(),
  }).index("by_goal", ["goalId"]),

  // ==================== AI ASSISTANT ====================

  /**
   * Conversations - AI chat conversations
   */
  conversations: defineTable({
    userId: v.string(),
    title: v.string(),
    lastMessageAt: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_date", ["userId", "lastMessageAt"]),

  /**
   * Messages - Chat messages in conversations
   */
  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    metadata: v.optional(
      v.object({
        model: v.optional(v.string()),
        tokens: v.optional(v.number()),
        confidence: v.optional(v.number()),
      })
    ),
    timestamp: v.number(),
  }).index("by_conversation", ["conversationId"]),

  /**
   * AI Insights - Proactive AI-generated insights
   */
  aiInsights: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("pricing"),
      v.literal("revenue_forecast"),
      v.literal("client_risk"),
      v.literal("opportunity")
    ),
    title: v.string(),
    content: v.string(),
    data: v.any(),
    actionTaken: v.boolean(),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_type", ["type"]),

  // ==================== COMMUNITY FEATURES ====================

  /**
   * Posts - Community posts
   */
  posts: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("story"),
      v.literal("question"),
      v.literal("achievement"),
      v.literal("tip")
    ),
    content: v.string(),
    mediaUrls: v.array(v.string()),
    tags: v.array(v.string()),
    likeCount: v.number(),
    commentCount: v.number(),
    viewCount: v.number(),
    isPinned: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_created", ["createdAt"]),

  /**
   * Post Likes - Likes on posts
   */
  postLikes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    createdAt: v.number(),
  }).index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_user", ["postId", "userId"]),

  /**
   * Comments - Comments on posts
   */
  comments: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    content: v.string(),
    likeCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_post", ["postId"])
    .index("by_user", ["userId"]),

  /**
   * Direct Messages - Private messages between users
   */
  directMessages: defineTable({
    conversationId: v.string(), // Composite: smaller_userId:larger_userId
    senderId: v.string(),
    receiverId: v.string(),
    content: v.string(),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"])
    .index("by_receiver", ["receiverId"]),

  /**
   * Follows - User following relationships
   */
  follows: defineTable({
    followerId: v.string(),
    followingId: v.string(),
    createdAt: v.number(),
  }).index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_following", ["followerId", "followingId"]),

  /**
   * Mentorships - Mentor-mentee relationships
   */
  mentorships: defineTable({
    mentorId: v.string(),
    menteeId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    goal: v.string(),
    sessionsCompleted: v.number(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_mentor", ["mentorId"])
    .index("by_mentee", ["menteeId"]),

  /**
   * Mentorship Sessions - Individual mentorship sessions
   */
  mentorshipSessions: defineTable({
    mentorshipId: v.id("mentorships"),
    scheduledAt: v.number(),
    duration: v.number(), // in minutes
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    completedAt: v.optional(v.number()),
  }).index("by_mentorship", ["mentorshipId"]),
});
