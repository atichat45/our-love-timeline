'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

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

interface MapComponentProps {
  memories: Memory[];
  center: [number, number];
  zoom: number;
  selectedMemory: Memory | null;
  setSelectedMemory: (memory: Memory | null) => void;
}

// This component updates the map when center/zoom changes
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const MapComponent = ({ 
  memories, 
  center, 
  zoom, 
  selectedMemory, 
  setSelectedMemory 
}: MapComponentProps) => {
  
  // Fix for Leaflet marker icon issue in Next.js
  useEffect(() => {
    // This is needed to fix Leaflet marker icons
    delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Custom marker icon
  const customIcon = useMemo(() => new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iI2VjNGFhOSI+PHBhdGggZmlsbFJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjA1IDQuMDVhNyA3IDAgMTE5LjkgOS45TDEwIDE4LjlsLTQuOTUtNC45NWE3IDcgMCAwMTAtOS45ek0xMCAxMWEyIDIgMCAxMDAtNCAyIDIgMCAwMDAgNHoiIGNsaXBSdWxlPSJldmVub2RkIiAvPjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }), []);

  // Use clientSideOnly for memory dates to prevent hydration mismatch
  const clientSideOnly = typeof window !== 'undefined';

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController center={center} zoom={zoom} />
      
      {memories.filter(memory => memory.location).map((memory) => (
        <Marker
          key={memory.id}
          position={[memory.location!.latitude, memory.location!.longitude]}
          icon={customIcon}
          eventHandlers={{
            click: () => setSelectedMemory(memory),
          }}
        >
          {selectedMemory && selectedMemory.id === memory.id && (
            <Popup 
              key={`popup-${memory.id}`}
            >
              <div 
                className="p-2 max-w-[300px]"
                onMouseLeave={() => {
                  // This is an alternative way to detect when user is done with the popup
                  // We'll use a timeout to prevent accidental closures
                  setTimeout(() => {
                    if (selectedMemory && selectedMemory.id === memory.id) {
                      setSelectedMemory(null);
                    }
                  }, 200);
                }}
              >
                <h3 className="text-lg font-semibold text-gray-800">{memory.title}</h3>
                {clientSideOnly && (
                  <p className="text-sm text-gray-500 mb-2">{formatDate(new Date(memory.date))}</p>
                )}
                
                {memory.mediaItems.length > 0 && memory.mediaItems[0].type === 'IMAGE' && (
                  <div className="relative h-32 w-full mb-2 rounded overflow-hidden">
                    <Image
                      src={memory.mediaItems[0].url}
                      alt={memory.mediaItems[0].caption || memory.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                {memory.description && (
                  <p className="text-sm text-gray-700 mb-1">{memory.description}</p>
                )}
                
                {memory.location && (
                  <p className="text-xs text-gray-500">
                    <span className="inline-block mr-1">📍</span>
                    {memory.location.name}
                  </p>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent; 