'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TimelineEvent from './TimelineEvent';

// Define the Memory type locally instead of importing from Prisma
interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  locationId: string | null;
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

// Sample timeline data for guest mode when API fails
const sampleTimelineEvents: Memory[] = [
  {
    id: 'sample-1',
    title: 'First Date',
    description: 'Our first date at the coffee shop',
    date: new Date('2022-01-15'),
    locationId: null,
    mediaItems: [],
    timelineEvent: {
      id: 'timeline-1',
      title: 'First Date',
      description: 'When we first met for coffee and talked for hours',
      date: new Date('2022-01-15'),
      importance: 5
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'sample-2',
    title: 'First Kiss',
    description: 'Our first kiss under the stars',
    date: new Date('2022-02-14'),
    locationId: null,
    mediaItems: [],
    timelineEvent: {
      id: 'timeline-2',
      title: 'Valentine\'s Day',
      description: 'Our first Valentine\'s Day together',
      date: new Date('2022-02-14'),
      importance: 4
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'sample-3',
    title: 'Moving In Together',
    description: 'The day we moved in together',
    date: new Date('2022-06-01'),
    locationId: null,
    mediaItems: [],
    timelineEvent: {
      id: 'timeline-3',
      title: 'New Home',
      description: 'When we decided to share our lives under one roof',
      date: new Date('2022-06-01'),
      importance: 5
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const Timeline = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);

  useEffect(() => {
    const fetchTimelineEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/memories?timelineOnly=true');
        
        if (!response.ok) {
          // Use sample data instead of showing an error
          console.warn('Failed to fetch timeline events, using sample data');
          setUsingSampleData(true);
          setMemories(sampleTimelineEvents);
          return;
        }
        
        const data = await response.json();
        // Filter only memories that have a timelineEvent
        const timelineMemories = data.filter((memory: Memory) => memory.timelineEvent);
        
        if (timelineMemories.length === 0) {
          // Use sample data if no timeline events are returned
          setUsingSampleData(true);
          setMemories(sampleTimelineEvents);
          return;
        }
        
        // Sort by date
        timelineMemories.sort((a: Memory, b: Memory) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        setMemories(timelineMemories);
      } catch (err) {
        console.error('Error fetching timeline events:', err);
        setUsingSampleData(true);
        setMemories(sampleTimelineEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="relative py-10 px-4">
      {usingSampleData && (
        <div className="mb-6 py-2 px-4 bg-yellow-100 text-yellow-800 rounded-md text-sm text-center">
          Showing sample timeline data. Database connection not available.
        </div>
      )}
      
      {/* Vertical line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-300 via-purple-400 to-blue-500"></div>
      
      {memories.map((memory, index) => (
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative mb-16 ${index % 2 === 0 ? 'text-right pr-10 md:pr-0 md:text-right md:ml-auto md:mr-[50%] md:pr-10' : 'text-left pl-10 md:pl-0 md:text-left md:mr-auto md:ml-[50%] md:pl-10'}`}
          style={{ maxWidth: '45%' }}
        >
          {memory.timelineEvent && (
            <TimelineEvent 
              memory={memory} 
              isEven={index % 2 === 0} 
              importance={memory.timelineEvent.importance}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline; 