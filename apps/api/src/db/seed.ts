import 'dotenv/config';
import { db, pool } from './client.js';
import { users } from './schema/users.js';
import { severityConfig } from './schema/severityConfig.js';
import { logger } from '../lib/logger.js';
import argon2 from 'argon2';
import { DEFAULT_SEVERITY_WEIGHTS } from '@satmss/shared-constants';

async function seed(): Promise<void> {
  logger.info('Starting database seeding...');
  try {
    // 1. Seed default administrator and analyst users
    const adminEmail = 'admin@satmss.gov.in';
    const analystEmail = 'analyst.aryan@satmss.gov.in';
    const directorEmail = 'director.raj@satmss.gov.in';

    const existingUsers = await db.select().from(users);
    
    let adminId = existingUsers.find(u => u.email === adminEmail)?.id;

    if (existingUsers.length === 0) {
      logger.info('No users found. Creating default seed users...');
      const passwordHash = await argon2.hash('SatmssPassword2026!');

      // Create Admin
      const [adminUser] = await db.insert(users).values({
        email: adminEmail,
        passwordHash,
        name: 'System Admin',
        organization: 'NRSC',
        role: 'ADMIN',
        isActive: true,
      }).returning();
      adminId = adminUser!.id;

      // Create Analyst
      await db.insert(users).values({
        email: analystEmail,
        passwordHash,
        name: 'Dr. Aryan Mehta',
        organization: 'NRSC',
        role: 'ANALYST',
        isActive: true,
        createdBy: adminId,
      });

      // Create Director
      await db.insert(users).values({
        email: directorEmail,
        passwordHash,
        name: 'Shri Rajan Pillai',
        organization: 'Ministry of Mines',
        role: 'DIRECTOR',
        isActive: true,
        createdBy: adminId,
      });

      logger.info('Default seed users created successfully');
    } else {
      logger.info('Users already exist, skipping user seeding');
    }

    // 2. Seed Default Severity Configurations
    const existingSeverityConfig = await db.select().from(severityConfig);
    if (existingSeverityConfig.length === 0 && adminId) {
      logger.info('Seeding default severity configuration weights...');
      for (const factor of DEFAULT_SEVERITY_WEIGHTS) {
        await db.insert(severityConfig).values({
          factorName: factor.factorName,
          factorLabel: factor.factorLabel,
          weightPct: factor.weightPct,
          updatedBy: adminId,
        });
      }
      logger.info('Default severity weights seeded successfully');
    } else {
      logger.info('Severity configurations already exist or no admin user found, skipping config seeding');
    }

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Failed to seed database', { error });
    process.exit(1);
  } finally {
    await pool.end();
  }
}

void seed();
