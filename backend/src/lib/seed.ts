import { prisma } from './prisma.js';
import { PropertyType, LeadSource, LeadStatus } from '../types/enums.js';
import { Prisma } from '@prisma/client';

export const seedSampleDataIfEmpty = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ [Database] Connected successfully to Neon PostgreSQL via Prisma');

    const count = await prisma.lead.count();
    if (count > 0) {
      console.log(`ℹ️ [Database Seeder] Found ${count} existing leads in database. Skipping seed.`);
      return;
    }

    console.log('🌱 [Database Seeder] Database is empty. Seeding initial sample leads...');

    const sampleLeads = [
      {
        name: 'Rahul Sharma',
        phone: '+91 9876543210',
        email: 'rahul.sharma@example.com',
        budget: new Prisma.Decimal(8500000), // 85 Lakhs
        location: 'Whitefield, Bangalore',
        propertyType: PropertyType.TWO_BHK,
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW,
        notes: {
          create: [
            { content: 'Enquired via website contact form looking for ready-to-move 2BHK.' },
          ],
        },
      },
      {
        name: 'Priya Nair',
        phone: '+91 9812345678',
        email: 'priya.nair@example.com',
        budget: new Prisma.Decimal(14000000), // 1.4 Cr
        location: 'Indiranagar, Bangalore',
        propertyType: PropertyType.THREE_BHK,
        source: LeadSource.GOOGLE,
        status: LeadStatus.CONTACTED,
        notes: {
          create: [
            { content: 'Called lead. Requested site visit for upcoming luxury apartment project.' },
            { content: 'Sent brochure via WhatsApp.' },
          ],
        },
      },
      {
        name: 'Amitabh Verma',
        phone: '+91 9765432109',
        email: 'averma@example.com',
        budget: new Prisma.Decimal(32000000), // 3.2 Cr
        location: 'Koramangala, Bangalore',
        propertyType: PropertyType.VILLA,
        source: LeadSource.REFERRAL,
        status: LeadStatus.SITE_VISIT,
        notes: {
          create: [
            { content: 'Site visit completed on Saturday. Client liked the gated community layout.' },
            { content: 'Negotiating pricing details for Corner Plot Villa.' },
          ],
        },
      },
      {
        name: 'Sneha Kulkarni',
        phone: '+91 9988776655',
        email: 'sneha.k@example.com',
        budget: new Prisma.Decimal(6500000), // 65 Lakhs
        location: 'HSR Layout, Bangalore',
        propertyType: PropertyType.TWO_BHK,
        source: LeadSource.FACEBOOK,
        status: LeadStatus.CLOSED,
        notes: {
          create: [
            { content: 'Booking amount received. Agreement draft shared.' },
            { content: 'Deal closed successfully!' },
          ],
        },
      },
      {
        name: 'Vikram Malhotra',
        phone: '+91 9123456789',
        email: 'vikram.m@example.com',
        budget: new Prisma.Decimal(45000000), // 4.5 Cr
        location: 'Sarjapur Road, Bangalore',
        propertyType: PropertyType.COMMERCIAL,
        source: LeadSource.WALK_IN,
        status: LeadStatus.SITE_VISIT,
        notes: {
          create: [
            { content: 'Walked in at branch office looking for 2000 sq ft office space.' },
          ],
        },
      },
      {
        name: 'Ananya Roy',
        phone: '+91 9432109876',
        email: 'ananya.roy@example.com',
        budget: new Prisma.Decimal(5000000), // 50 Lakhs
        location: 'Electronic City, Bangalore',
        propertyType: PropertyType.ONE_BHK,
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW,
        notes: {
          create: [
            { content: 'First-time home buyer looking for IT park proximity.' },
          ],
        },
      },
    ];

    for (const leadData of sampleLeads) {
      await prisma.lead.create({
        data: leadData,
      });
    }

    console.log('✅ [Database Seeder] Sample real estate leads & notes seeded successfully into Neon PostgreSQL!');
  } catch (error) {
    console.error('❌ [Database] Connection or Seeding Error:', error);
  }
};
