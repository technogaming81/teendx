import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get user profile by user ID
 */
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return profile;
  },
});

/**
 * Create user profile during onboarding
 */
export const createUserProfile = mutation({
  args: {
    userId: v.string(),
    displayName: v.string(),
    age: v.number(),
    role: v.string(),
    location: v.string(),
    skills: v.array(v.string()),
    avatar: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const profileId = await ctx.db.insert("userProfiles", {
      ...args,
      isOnboarded: false,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize gamification stats
    await ctx.db.insert("gamificationStats", {
      userId: args.userId,
      xp: 0,
      level: 1,
      totalEarnings: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: now,
      weeklyStreak: 0,
      totalBadges: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize user preferences
    await ctx.db.insert("userPreferences", {
      userId: args.userId,
      theme: "dark",
      emailNotifications: true,
      pushNotifications: true,
      language: "en",
      currency: "INR",
      timezone: "Asia/Kolkata",
    });

    return profileId;
  },
});

/**
 * Mark user as onboarded
 */
export const completeOnboarding = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    await ctx.db.patch(profile._id, {
      isOnboarded: true,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get gamification stats for user
 */
export const getGamificationStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("gamificationStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return stats;
  },
});

/**
 * Award XP to user
 */
export const awardXP = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("gamificationStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!stats) {
      throw new Error("Gamification stats not found");
    }

    const newXP = stats.xp + args.amount;
    const newLevel = calculateLevel(newXP);

    await ctx.db.patch(stats._id, {
      xp: newXP,
      level: newLevel,
      updatedAt: Date.now(),
    });

    return {
      newXP,
      newLevel,
      leveledUp: newLevel > stats.level,
    };
  },
});

/**
 * Calculate level from XP
 * Formula: Level N requires 100 * N * (N + 1) / 2 XP
 */
function calculateLevel(xp: number): number {
  let level = 1;
  while (xp >= 100 * level * (level + 1) / 2) {
    level++;
  }
  return level;
}
