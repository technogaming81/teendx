// User & Authentication Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  subscriptionTier: 'free' | 'pro';
  subscriptionEnds?: Date;
  businessName?: string;
  businessLogo?: string;
  gstNumber?: string;
  panNumber?: string;
  theme: 'light' | 'dark';
  language: string;
  compactMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Client Types
export interface Client {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country: string;
  notes?: string;
  tags: string[];
  healthScore?: number;
  acquisitionSource?: string;
  totalPaid: number;
  totalDue: number;
  lifetimeValue: number;
  createdAt: Date;
  updatedAt: Date;
  lastContactDate?: Date;
}

// Invoice Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  clientId: string;
  status: InvoiceStatus;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  paymentLinkId?: string;
  paymentQRCode?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  description?: string;
  notes?: string;
  terms?: string;
  pdfUrl?: string;
  sentAt?: Date;
  viewedAt?: Date;
  remindersSent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate: number;
  createdAt: Date;
}

// Payment Types
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentGateway?: string;
  transactionId?: string;
  status: PaymentStatus;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Expense Types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod?: string;
  receiptUrl?: string;
  isTaxDeductible: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Project Types
export type ProjectStatus = 'active' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  userId: string;
  clientId?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  estimatedValue?: number;
  actualValue?: number;
  startDate?: Date;
  endDate?: Date;
  completedAt?: Date;
  progressPercent: number;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  description?: string;
  hours: number;
  date: Date;
  createdAt: Date;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  xpReward: number;
  criteria: Record<string, unknown>;
  createdAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: Date;
}

export type GoalType = 'income' | 'clients' | 'projects' | 'savings';
export type GoalPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  period: GoalPeriod;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: string;
  target: number;
  date: Date;
  createdAt: Date;
}

// Community Types
export type CommunityChannel = 'wins' | 'questions' | 'collaborate' | 'tips';
export type PostStatus = 'published' | 'flagged' | 'removed';

export interface CommunityPost {
  id: string;
  userId: string;
  content: string;
  channel: CommunityChannel;
  likesCount: number;
  commentsCount: number;
  isAnonymous: boolean;
  status: PostStatus;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
  createdAt: Date;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  userId: string;
  activityType: string;
  metadata?: Record<string, unknown>;
  xpEarned: number;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// AI Service Types
export interface PricingSuggestion {
  minPrice: number;
  maxPrice: number;
  confidence: number;
  reasoning?: string;
  recommendedPrice: number;
}

export interface TaxCalculation {
  totalIncome: number;
  totalExpenses: number;
  taxableIncome: number;
  estimatedTax: number;
  section44ADA: boolean;
  gstRequired: boolean;
  suggestions: string[];
}

export interface ClientHealthScore {
  score: number;
  punctualityScore: number;
  historyScore: number;
  valueScore: number;
  communicationScore: number;
  label: 'excellent' | 'good' | 'fair' | 'at-risk';
}
