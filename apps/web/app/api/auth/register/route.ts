import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@teendx/database';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must include uppercase, lowercase, number, and special character'
  ),
  dateOfBirth: z.string().transform((str) => new Date(str)),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check age (must be between 15-21)
    const age = new Date().getFullYear() - validated.dateOfBirth.getFullYear();
    if (age < 15 || age > 21) {
      return NextResponse.json(
        {
          success: false,
          error: 'Teendx is for freelancers aged 15-21',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'This email is already registered. Try logging in?',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        hashedPassword,
        dateOfBirth: validated.dateOfBirth,
        level: 1,
        xp: 0,
        currentStreak: 0,
        subscriptionTier: 'free',
        theme: 'light',
        language: 'en',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Create activity log for registration
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        activityType: 'user_registered',
        xpEarned: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: user.id,
          name: user.name,
          email: user.email,
        },
        message: 'Account created successfully! Please log in.',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
