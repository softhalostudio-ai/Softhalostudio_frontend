import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Found', messages.length, 'messages:');
    console.log(JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMessages();
