'use client';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  locationId: string | null;
  location?: {
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
  timelineEvent?: {
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

// GET /api/memories/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Memory | ErrorResponse>> {
  try {
    const memoryId = params.id;
    
    // Validate that ID exists
    if (!memoryId) {
      return NextResponse.json({ error: 'Memory ID is required' }, { status: 400 });
    }
    
    // Fetch memory with location, mediaItems, and timelineEvent
    const memory = await prisma.memory.findUnique({
      where: {
        id: memoryId,
      },
      include: {
        location: true,
        mediaItems: true,
        timelineEvent: true,
      },
    });
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    
    return NextResponse.json(memory);
  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 });
  }
}

// PUT /api/memories/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Memory | ErrorResponse>> {
  try {
    const memoryId = params.id;
    
    // Validate that ID exists
    if (!memoryId) {
      return NextResponse.json({ error: 'Memory ID is required' }, { status: 400 });
    }
    
    // Parse request body
    const data = await request.json() as Partial<Memory>;
    
    // Validate request body has required fields
    if (
      !data ||
      typeof data !== 'object' ||
      Object.keys(data).length === 0
    ) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    // Check if memory exists
    const existingMemory = await prisma.memory.findUnique({
      where: {
        id: memoryId,
      },
    });
    
    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    
    // Prepare the update data (exclude related entities)
    const updateData = { ...data };
    delete updateData.location;
    delete updateData.mediaItems;
    delete updateData.timelineEvent;
    
    // Update the memory
    try {
      const memory = await prisma.memory.update({
        where: {
          id: memoryId,
        },
        data: updateData,
        include: {
          location: true,
          mediaItems: true,
          timelineEvent: true,
        },
      });
      
      return NextResponse.json(memory);
    } catch (error) {
      console.error('Error updating memory:', error);
      return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

// DELETE /api/memories/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
  try {
    const memoryId = params.id;
    
    // Validate that ID exists
    if (!memoryId) {
      return NextResponse.json({ error: 'Memory ID is required' }, { status: 400 });
    }
    
    // Check if memory exists
    const existingMemory = await prisma.memory.findUnique({
      where: {
        id: memoryId,
      },
    });
    
    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    
    // Delete the memory
    await prisma.memory.delete({
      where: {
        id: memoryId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
} 