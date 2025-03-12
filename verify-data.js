const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const memoriesCount = await prisma.memory.count();
    const locationsCount = await prisma.location.count();
    const mediaCount = await prisma.media.count();
    const timelineEventsCount = await prisma.timelineEvent.count();
    
    console.log(`Database has:
- ${memoriesCount} memories
- ${locationsCount} locations
- ${mediaCount} media items
- ${timelineEventsCount} timeline events`);
    
    // Get a sample of memories with all related data
    const memories = await prisma.memory.findMany({
      include: {
        location: true,
        mediaItems: true,
        timelineEvent: true
      },
      take: 3
    });
    
    console.log('Sample of memories:', JSON.stringify(memories, null, 2));
  } catch (e) {
    console.error('Error checking data:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 