import { PrismaClient, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await argon2.hash('ChangeMe123!');

  await prisma.user.upsert({
    where: { email: 'ayush.zala@patterns247.net' },
    update: {},
    create: {
      email: 'ayush.zala@patterns247.net',
      passwordHash,
      firstName: 'Super',
      lastName: 'Administrator',
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect prisma client here when it's implemented
  });
