import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default badges
  const badges = [
    {
      name: 'First Invoice',
      description: 'Created your first invoice',
      iconUrl: '/badges/first-invoice.svg',
      category: 'milestone',
      xpReward: 50,
      criteria: { type: 'invoice_count', value: 1 },
    },
    {
      name: 'First Payment',
      description: 'Received your first payment',
      iconUrl: '/badges/first-payment.svg',
      category: 'milestone',
      xpReward: 100,
      criteria: { type: 'payment_count', value: 1 },
    },
    {
      name: '₹10K Earned',
      description: 'Earned your first ₹10,000',
      iconUrl: '/badges/10k-earned.svg',
      category: 'achievement',
      xpReward: 200,
      criteria: { type: 'total_earnings', value: 10000 },
    },
    {
      name: '₹50K Earned',
      description: 'Earned ₹50,000 in total',
      iconUrl: '/badges/50k-earned.svg',
      category: 'achievement',
      xpReward: 500,
      criteria: { type: 'total_earnings', value: 50000 },
    },
    {
      name: '₹1L Earned',
      description: 'Earned ₹1,00,000 in total',
      iconUrl: '/badges/1l-earned.svg',
      category: 'achievement',
      xpReward: 1000,
      criteria: { type: 'total_earnings', value: 100000 },
    },
    {
      name: 'Invoice Master',
      description: 'Created 50 invoices',
      iconUrl: '/badges/invoice-master.svg',
      category: 'achievement',
      xpReward: 300,
      criteria: { type: 'invoice_count', value: 50 },
    },
    {
      name: '7-Day Streak',
      description: 'Maintained a 7-day activity streak',
      iconUrl: '/badges/7-day-streak.svg',
      category: 'streak',
      xpReward: 100,
      criteria: { type: 'streak_days', value: 7 },
    },
    {
      name: '30-Day Streak',
      description: 'Maintained a 30-day activity streak',
      iconUrl: '/badges/30-day-streak.svg',
      category: 'streak',
      xpReward: 500,
      criteria: { type: 'streak_days', value: 30 },
    },
    {
      name: 'Tax Wizard',
      description: 'Generated your first tax estimate',
      iconUrl: '/badges/tax-wizard.svg',
      category: 'milestone',
      xpReward: 150,
      criteria: { type: 'tax_estimate_count', value: 1 },
    },
    {
      name: '10 Clients',
      description: 'Added 10 clients',
      iconUrl: '/badges/10-clients.svg',
      category: 'achievement',
      xpReward: 200,
      criteria: { type: 'client_count', value: 10 },
    },
    {
      name: 'Community Star',
      description: 'Made your first community post',
      iconUrl: '/badges/community-star.svg',
      category: 'community',
      xpReward: 50,
      criteria: { type: 'community_post_count', value: 1 },
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }

  console.log(`✅ Created ${badges.length} badges`);

  // Create default expense categories
  console.log('✅ Database seed completed');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
