'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import GalleryItem from './GalleryItem';

interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption: string | null;
  memoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string | null;
  } | null;
  mediaItems: Media[];
}

// Sample gallery data for guest mode when API fails
const sampleMemories: Memory[] = [
  {
    id: 'sample-1',
    title: 'Beach Day',
    description: 'Our day at the beach last summer',
    date: new Date('2022-07-15'),
    location: {
      id: 'loc-1',
      name: 'Malibu Beach',
      latitude: 34.0259,
      longitude: -118.7798,
      address: 'Malibu, CA'
    },
    mediaItems: [
      {
        id: 'media-1',
        url: 'https://placehold.co/600x400/pink/white?text=Beach+Photo',
        type: 'IMAGE',
        caption: 'Sunset at the beach',
        memoryId: 'sample-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'media-2',
        url: 'https://placehold.co/600x400/lightblue/white?text=Beach+Selfie',
        type: 'IMAGE',
        caption: 'Our beach selfie',
        memoryId: 'sample-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: 'sample-2',
    title: 'Birthday Celebration',
    description: 'Your surprise birthday party',
    date: new Date('2022-09-22'),
    location: {
      id: 'loc-2',
      name: 'Home',
      latitude: 34.0522,
      longitude: -118.2437,
      address: 'Los Angeles, CA'
    },
    mediaItems: [
      {
        id: 'media-3',
        url: 'https://placehold.co/600x400/purple/white?text=Birthday+Cake',
        type: 'IMAGE',
        caption: 'The birthday cake',
        memoryId: 'sample-2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

const Gallery = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/memories');
        
        if (!response.ok) {
          // Use sample data instead of showing an error
          console.warn('Failed to fetch memories, using sample data');
          setUsingSampleData(true);
          setMemories(sampleMemories);
          return;
        }
        
        const data = await response.json();
        // Filter only memories that have media items
        const memoriesWithMedia = data.filter((memory: Memory) => 
          memory.mediaItems && memory.mediaItems.length > 0
        );
        
        if (memoriesWithMedia.length === 0) {
          // Use sample data if no memories with media are returned
          console.warn('No memories with media found, using sample data');
          setUsingSampleData(true);
          setMemories(sampleMemories);
          return;
        }
        
        setMemories(memoriesWithMedia);
      } catch (err) {
        console.error('Error fetching memories:', err);
        setUsingSampleData(true);
        setMemories(sampleMemories);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {usingSampleData && (
        <div className="mb-6 py-2 px-4 bg-yellow-100 text-yellow-800 rounded-md text-sm text-center">
          Showing sample gallery images. Database connection not available.
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {memories.map((memory) => (
          <div key={memory.id}>
            {memory.mediaItems.map((media) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="cursor-pointer"
                onClick={() => setSelectedMemory(memory)}
              >
                <GalleryItem media={media} memory={memory} />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal for viewing selected memory */}
      {selectedMemory && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedMemory.title}</h2>
                  <p className="text-sm text-gray-500">{formatDate(selectedMemory.date)}</p>
                  {selectedMemory.location && (
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="inline-block mr-1">📍</span>
                      {selectedMemory.location.name}
                    </p>
                  )}
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedMemory(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedMemory.description && (
                <p className="text-gray-700 mb-6">{selectedMemory.description}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedMemory.mediaItems.map((media) => (
                  <div key={media.id} className="relative">
                    {media.type === 'IMAGE' ? (
                      <div className="relative h-64 w-full rounded-lg overflow-hidden">
                        <Image
                          src={media.url}
                          alt={media.caption || selectedMemory.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative h-64 w-full rounded-lg overflow-hidden">
                        <video 
                          src={media.url} 
                          controls 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {media.caption && (
                      <p className="text-sm text-gray-600 mt-2">{media.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 