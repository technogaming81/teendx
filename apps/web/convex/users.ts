import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get current user profile
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    return user;
  },
});

// Get dashboard statistics
export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);

    // Count clients
    const clients = await ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const clientCount = clients.length;

    // Get all invoices
    const allInvoices = await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const invoiceCount = allInvoices.length;

    // Calculate total income (paid invoices)
    const paidInvoices = allInvoices.filter((inv) => inv.status === "paid");
    const totalIncome = paidInvoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );

    // Calculate pending amount
    const pendingInvoices = allInvoices.filter(
      (inv) => inv.status === "sent" || inv.status === "overdue"
    );
    const pendingAmount = pendingInvoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );

    // Get expenses
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const expenseCount = expenses.length;
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Get projects
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const projectCount = projects.length;

    return {
      user: {
        name: user?.name,
        level: user?.level,
        xp: user?.xp,
        currentStreak: user?.currentStreak,
      },
      counts: {
        clients: clientCount,
        invoices: invoiceCount,
        expenses: expenseCount,
        projects: projectCount,
      },
      financials: {
        totalIncome,
        pendingAmount,
        totalExpenses,
      },
    };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    businessName: v.optional(v.string()),
    gstNumber: v.optional(v.string()),
    panNumber: v.optional(v.string()),
    theme: v.optional(v.string()),
    compactMode: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(userId, args);
    return userId;
  },
});

// Initialize user profile after signup
export const initializeProfile = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    dateOfBirth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already has a profile
    const existingUser = await ctx.db.get(userId);
    if (existingUser) {
      return userId;
    }

    // Create user profile
    await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      dateOfBirth: args.dateOfBirth,
      level: 1,
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      subscriptionTier: "free",
      theme: "light",
      language: "en",
      compactMode: false,
    });

    // Log activity
    await ctx.db.insert("activityLogs", {
      userId,
      activityType: "user_registered",
      xpEarned: 0,
    });

    return userId;
  },
});
