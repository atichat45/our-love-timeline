'use client';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

interface MemoryWithRelations {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  locationId: string | null;
  location: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string | null;
  } | null;
  mediaItems: {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
    caption: string | null;
  }[];
  timelineEvent: {
    id: string;
    title: string;
    description: string | null;
    date: Date;
    importance: number;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ErrorResponse {
  error: string;
}

// GET /api/memories
export async function GET(
  req: NextRequest
): Promise<NextResponse<MemoryWithRelations[] | ErrorResponse>> {
  try {
    // Check if we only want timeline items
    const searchParams = req.nextUrl.searchParams;
    const timelineOnly = searchParams.get('timelineOnly') === 'true';
    
    let memories;
    
    if (timelineOnly) {
      memories = await prisma.memory.findMany({
        where: {
          timelineEvent: {
            isNot: null,
          },
        },
        include: {
          location: true,
          mediaItems: true,
          timelineEvent: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
    } else {
      memories = await prisma.memory.findMany({
        include: {
          location: true,
          mediaItems: true,
          timelineEvent: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
    }
    
    return NextResponse.json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

// POST /api/memories
export async function POST(
  req: NextRequest
): Promise<NextResponse<MemoryWithRelations | ErrorResponse>> {
  try {
    const data = await req.json();
    
    // Validate data
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    // Extract related entities from request data
    const { location, mediaItems, timelineEvent, ...memoryData } = data;
    
    // Create the memory and related entities in a transaction
    const createdMemory = await prisma.$transaction(async (prismaTransaction) => {
      // Create the memory
      const memory = await prismaTransaction.memory.create({
        data: {
          ...memoryData,
          // If location is provided, create or connect to it
          ...(location && {
            location: {
              create: location,
            },
          }),
          // If timeline event is provided, create it
          ...(timelineEvent && {
            timelineEvent: {
              create: timelineEvent,
            },
          }),
        },
        include: {
          location: true,
          timelineEvent: true,
        },
      });
      
      // If media items are provided, create them
      if (mediaItems && Array.isArray(mediaItems) && mediaItems.length > 0) {
        await Promise.all(
          mediaItems.map((mediaItem) =>
            prismaTransaction.media.create({
              data: {
                ...mediaItem,
                memoryId: memory.id,
              },
            })
          )
        );
      }
      
      // Fetch the complete memory with all relations
      return prismaTransaction.memory.findUnique({
        where: { id: memory.id },
        include: {
          location: true,
          mediaItems: true,
          timelineEvent: true,
        },
      });
    });
    
    return NextResponse.json(createdMemory as MemoryWithRelations);
  } catch (error) {
    console.error('Error creating memory:', error);
    let errorMessage = 'Failed to create memory';
    
    // If it's a Prisma error, provide more details
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        errorMessage = 'A memory with this name already exists';
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 