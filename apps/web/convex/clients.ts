import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get all clients for the current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const clients = await ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get invoice and project counts for each client
    const clientsWithCounts = await Promise.all(
      clients.map(async (client) => {
        const invoiceCount = await ctx.db
          .query("invoices")
          .withIndex("by_client", (q) => q.eq("clientId", client._id))
          .collect()
          .then((invoices) => invoices.length);

        const projectCount = await ctx.db
          .query("projects")
          .withIndex("by_client", (q) => q.eq("clientId", client._id))
          .collect()
          .then((projects) => projects.length);

        return {
          ...client,
          _count: {
            invoices: invoiceCount,
            projects: projectCount,
          },
        };
      })
    );

    return clientsWithCounts;
  },
});

// Get a single client by ID
export const get = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const client = await ctx.db.get(args.id);
    if (!client || client.userId !== userId) {
      throw new Error("Client not found");
    }

    // Get recent invoices
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_client", (q) => q.eq("clientId", args.id))
      .order("desc")
      .take(10);

    // Get recent projects
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", args.id))
      .order("desc")
      .take(5);

    return {
      ...client,
      invoices,
      projects,
    };
  },
});

// Create a new client
export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    gstNumber: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    pincode: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    acquisitionSource: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const clientId = await ctx.db.insert("clients", {
      userId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      company: args.company,
      gstNumber: args.gstNumber,
      address: args.address,
      city: args.city,
      state: args.state,
      pincode: args.pincode,
      country: "India",
      notes: args.notes,
      tags: args.tags || [],
      acquisitionSource: args.acquisitionSource,
      totalPaid: 0,
      totalDue: 0,
      lifetimeValue: 0,
    });

    // Log activity for XP
    await ctx.db.insert("activityLogs", {
      userId,
      activityType: "client_added",
      metadata: { clientId },
      xpEarned: 10,
    });

    return clientId;
  },
});

// Update a client
export const update = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    gstNumber: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    pincode: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const client = await ctx.db.get(args.id);
    if (!client || client.userId !== userId) {
      throw new Error("Client not found");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);

    return id;
  },
});

// Delete a client
export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const client = await ctx.db.get(args.id);
    if (!client || client.userId !== userId) {
      throw new Error("Client not found");
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
