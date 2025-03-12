const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sample data for memories, locations, and media
const sampleData = [
  {
    title: "First Date",
    description: "Our first date at the Italian restaurant downtown. We talked for hours about our favorite books and movies.",
    date: new Date('2023-02-14'),
    location: {
      name: "Giovanni's Restaurant",
      latitude: 40.7128,
      longitude: -74.0060,
      address: "123 Main St, New York, NY"
    },
    timelineEvent: {
      title: "Our First Date",
      description: "When we first met at Giovanni's Restaurant",
      importance: 5
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=First+Selfie",
        type: "IMAGE",
        caption: "First selfie together"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=Flowers",
        type: "IMAGE",
        caption: "Flowers from that night"
      }
    ]
  },
  {
    title: "Beach Weekend",
    description: "Spontaneous trip to the beach. We built sandcastles and watched the sunset.",
    date: new Date('2023-04-22'),
    location: {
      name: "Malibu Beach",
      latitude: 34.0259,
      longitude: -118.7798,
      address: "Malibu, CA"
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=Sunset+at+the+beach",
        type: "IMAGE",
        caption: "Sunset at the beach"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=Us+at+the+shoreline",
        type: "IMAGE",
        caption: "Us at the shoreline"
      }
    ]
  },
  {
    title: "Anniversary Dinner",
    description: "Celebrating our first year together with a special dinner at the rooftop restaurant.",
    date: new Date('2024-02-14'),
    location: {
      name: "Skyline Restaurant",
      latitude: 40.7484,
      longitude: -73.9857,
      address: "Empire State Building, New York, NY"
    },
    timelineEvent: {
      title: "One Year Anniversary",
      description: "Our first year together",
      importance: 5
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=Anniversary+dinner",
        type: "IMAGE",
        caption: "Anniversary dinner"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=The+gift+I+got+you",
        type: "IMAGE",
        caption: "The gift I got you"
      }
    ]
  },
  {
    title: "Hiking Trip",
    description: "Challenging hike up the mountain trail. The view from the top was worth every step!",
    date: new Date('2023-07-15'),
    location: {
      name: "Eagle Mountain Trail",
      latitude: 37.7749,
      longitude: -122.4194,
      address: "Eagle Mountain, CA"
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=Trail+view",
        type: "IMAGE",
        caption: "Trail view"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=At+the+summit",
        type: "IMAGE",
        caption: "At the summit"
      }
    ]
  },
  {
    title: "Concert Night",
    description: "Surprise tickets to see your favorite band live. Your face when you realized where we were going was priceless!",
    date: new Date('2023-09-10'),
    location: {
      name: "Madison Square Garden",
      latitude: 40.7505,
      longitude: -73.9934,
      address: "4 Pennsylvania Plaza, New York, NY"
    },
    timelineEvent: {
      title: "The Concert",
      description: "Your favorite band live",
      importance: 4
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=The+concert",
        type: "IMAGE",
        caption: "The concert"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=Your+favorite+song",
        type: "VIDEO",
        caption: "Your favorite song"
      }
    ]
  },
  {
    title: "Cooking Adventure",
    description: "Attempting to make sushi at home. It was messy but delicious!",
    date: new Date('2023-05-20'),
    location: {
      name: "Home",
      latitude: 40.7282,
      longitude: -73.7949,
      address: "Queens, NY"
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=Cooking+together",
        type: "IMAGE",
        caption: "Cooking together"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=Our+sushi+creation",
        type: "IMAGE",
        caption: "Our sushi creation"
      }
    ]
  },
  {
    title: "Winter Getaway",
    description: "Weekend trip to the cabin in the mountains. We built a snowman and had hot chocolate by the fire.",
    date: new Date('2023-12-23'),
    location: {
      name: "Pine Ridge Cabin",
      latitude: 43.0962,
      longitude: -79.0377,
      address: "Aspen, CO"
    },
    timelineEvent: {
      title: "Winter Cabin Trip",
      description: "Our cozy winter getaway",
      importance: 3
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=The+cabin",
        type: "IMAGE",
        caption: "The cabin"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=Snowman+building",
        type: "IMAGE",
        caption: "Snowman building"
      }
    ]
  },
  {
    title: "Art Gallery Opening",
    description: "That modern art exhibition we weren't sure about at first but ended up loving.",
    date: new Date('2023-08-05'),
    location: {
      name: "Metropolitan Art Gallery",
      latitude: 40.7794,
      longitude: -73.9632,
      address: "1000 Fifth Avenue, New York, NY"
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=Your+favorite+painting",
        type: "IMAGE",
        caption: "Your favorite painting"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=At+the+gallery",
        type: "IMAGE",
        caption: "At the gallery"
      }
    ]
  },
  {
    title: "Surprise Birthday Party",
    description: "When all your friends came together for your surprise party. Your reaction was unforgettable!",
    date: new Date('2023-10-15'),
    location: {
      name: "Friend's House",
      latitude: 40.7305,
      longitude: -73.9352,
      address: "Brooklyn, NY"
    },
    timelineEvent: {
      title: "Your Birthday Surprise",
      description: "When we celebrated your special day",
      importance: 4
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=The+surprise+moment",
        type: "IMAGE",
        caption: "The surprise moment"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=Birthday+cake",
        type: "IMAGE",
        caption: "Birthday cake"
      }
    ]
  },
  {
    title: "Road Trip",
    description: "Spontaneous road trip to the coast. We sang along to our favorite songs the whole way.",
    date: new Date('2023-06-18'),
    location: {
      name: "Pacific Coast Highway",
      latitude: 36.3615,
      longitude: -121.8563,
      address: "Big Sur, CA"
    },
    mediaItems: [
      {
        url: "https://placehold.co/600x400/pink/white?text=On+the+road",
        type: "IMAGE",
        caption: "On the road"
      },
      {
        url: "https://placehold.co/600x400/pink/white?text=Coastal+view",
        type: "IMAGE",
        caption: "Coastal view"
      }
    ]
  }
];

async function main() {
  console.log('Start seeding...');
  
  try {
    // Clear existing data
    await prisma.media.deleteMany();
    await prisma.timelineEvent.deleteMany();
    await prisma.memory.deleteMany();
    await prisma.location.deleteMany();
    
    console.log('Cleared existing data');
    
    // Create new data
    for (const memoryData of sampleData) {
      // Create location
      const location = await prisma.location.create({
        data: {
          name: memoryData.location.name,
          latitude: memoryData.location.latitude,
          longitude: memoryData.location.longitude,
          address: memoryData.location.address
        }
      });
      
      // Create memory
      const memoryInput = {
        title: memoryData.title,
        description: memoryData.description,
        date: memoryData.date,
        locationId: location.id
      };
      
      // Add timelineEvent if it exists
      if (memoryData.timelineEvent) {
        memoryInput.timelineEvent = {
          create: {
            title: memoryData.timelineEvent.title,
            description: memoryData.timelineEvent.description,
            date: memoryData.date,
            importance: memoryData.timelineEvent.importance
          }
        };
      }
      
      const memory = await prisma.memory.create({
        data: memoryInput
      });
      
      // Create media items
      for (const mediaItem of memoryData.mediaItems) {
        await prisma.media.create({
          data: {
            url: mediaItem.url,
            type: mediaItem.type,
            caption: mediaItem.caption,
            memoryId: memory.id
          }
        });
      }
      
      console.log(`Created memory: ${memoryData.title}`);
    }
    
    console.log('Seeding completed successfully!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 