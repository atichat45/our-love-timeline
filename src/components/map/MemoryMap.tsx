'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

// Interfaces for data models
interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption: string | null;
}

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: Location | null;
  mediaItems: Media[];
}

// Define the props interface for the MapComponent
interface MapComponentProps {
  memories: Memory[];
  center: [number, number];
  zoom: number;
  selectedMemory: Memory | null;
  setSelectedMemory: (memory: Memory | null) => void;
}

// Sample data to display when API fails
const sampleMemories: Memory[] = [
  {
    id: 'sample-1',
    title: 'First Date',
    description: 'Our first date at the park',
    date: new Date('2022-05-15'),
    location: {
      id: 'loc-1',
      name: 'Central Park',
      latitude: 40.785091,
      longitude: -73.968285,
      address: 'New York, NY'
    },
    mediaItems: []
  },
  {
    id: 'sample-2',
    title: 'Anniversary',
    description: 'Our anniversary dinner',
    date: new Date('2023-05-15'),
    location: {
      id: 'loc-2',
      name: 'Nice Restaurant',
      latitude: 40.758896,
      longitude: -73.985130,
      address: 'New York, NY'
    },
    mediaItems: []
  }
];

// Dynamically import the MapComponent with SSR disabled
const MapWithNoSSR = dynamic<MapComponentProps>(
  () => import('./MapComponent'),
  {
    ssr: false, // Critical for preventing hydration errors with Leaflet
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
        <LoadingSpinner size="lg" />
      </div>
    ),
  }
);

export default function MemoryMap() {
  // Use null as initial state to ensure consistent rendering
  const [loading, setLoading] = useState<boolean>(true);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);

  // Calculate default center and zoom - use constants to avoid hydration mismatches
  const defaultCenter: [number, number] = [40.7128, -74.0060]; // New York as default
  const defaultZoom = 12;
  
  // Calculate center based on memories if available
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(defaultZoom);

  // Only run this effect on the client
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/memories');
        
        if (!res.ok) {
          // If the API fails, use sample data
          console.warn('API failed, using sample data instead');
          setUsingSampleData(true);
          setMemories(sampleMemories);
          
          // Set map center to the first sample memory
          if (sampleMemories.length > 0 && sampleMemories[0].location) {
            setMapCenter([
              sampleMemories[0].location.latitude,
              sampleMemories[0].location.longitude
            ]);
          }
          return;
        }
        
        const data: Memory[] = await res.json();
        
        if (data.length === 0) {
          // If no memories are returned, use sample data
          setUsingSampleData(true);
          setMemories(sampleMemories);
          
          // Set map center to the first sample memory
          if (sampleMemories.length > 0 && sampleMemories[0].location) {
            setMapCenter([
              sampleMemories[0].location.latitude,
              sampleMemories[0].location.longitude
            ]);
          }
          return;
        }
        
        setMemories(data);
        
        // Calculate center if there are memories with locations
        if (data.length > 0) {
          const validLocations = data.filter(memory => memory.location);
          
          if (validLocations.length > 0) {
            const latSum = validLocations.reduce((sum, memory) => 
              sum + (memory.location?.latitude || 0), 0);
            const longSum = validLocations.reduce((sum, memory) => 
              sum + (memory.location?.longitude || 0), 0);
            
            const avgLat = latSum / validLocations.length;
            const avgLng = longSum / validLocations.length;
            
            setMapCenter([avgLat, avgLng]);
          }
        }
      } catch (err) {
        console.error('Error fetching memories:', err);
        setUsingSampleData(true);
        setMemories(sampleMemories);
        
        // Set map center to the first sample memory
        if (sampleMemories.length > 0 && sampleMemories[0].location) {
          setMapCenter([
            sampleMemories[0].location.latitude,
            sampleMemories[0].location.longitude
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  // Handle when a memory is selected or deselected
  const handleSelectMemory = (memory: Memory | null) => {
    setSelectedMemory(memory);
    
    // If a memory is selected, center the map on its location
    if (memory && memory.location) {
      setMapCenter([memory.location.latitude, memory.location.longitude]);
      setMapZoom(15); // Zoom in when a memory is selected
    }
  };
  
  // Use client-side only rendering for the map
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full w-full relative rounded-lg overflow-hidden">
      {usingSampleData && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-800 px-4 py-2 z-10 text-sm text-center">
          Using sample data. Database connection not available.
        </div>
      )}
      <MapWithNoSSR
        memories={memories}
        center={mapCenter}
        zoom={mapZoom}
        selectedMemory={selectedMemory}
        setSelectedMemory={handleSelectMemory}
      />
    </div>
  );
} 