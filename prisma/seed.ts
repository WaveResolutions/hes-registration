import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMe123!', 10);
  await prisma.adminUser.createMany({
    data: [
      { email: 'kshitiz@hamroeventsolutions.com', name: 'Kshitiz Shrestha', role: 'SUPER_ADMIN', password: hashed },
      { email: 'manish@hamroeventsolutions.com', name: 'Manish Chaudhary', role: 'SUPER_ADMIN', password: hashed },
      { email: 'adriane@hamroeventsolutions.com', name: 'Adriane Diaz', role: 'STAFF', password: hashed },
      { email: 'riya@hamroeventsolutions.com', name: 'Riya Dev', role: 'STAFF', password: hashed },
      { email: 'sol@hamroeventsolutions.com', name: 'Sol Moure Moreno', role: 'STAFF', password: hashed },
    ],
    skipDuplicates: true,
  });
  console.log('Seeded admin users');
}

main().catch(console.error).finally(() => prisma.$disconnect());
