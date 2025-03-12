// Type definitions for MapComponent
declare module './MapComponent' {
  export interface Media {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
    caption: string | null;
  }
  
  export interface Location {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string | null;
  }
  
  export interface Memory {
    id: string;
    title: string;
    description: string | null;
    date: Date;
    location: Location | null;
    mediaItems: Media[];
  }
  
  export interface MapComponentProps {
    memories: Memory[];
    center: [number, number];
    zoom: number;
    selectedMemory: Memory | null;
    setSelectedMemory: (memory: Memory | null) => void;
  }
  
  const MapComponent: React.FC<MapComponentProps>;
  export default MapComponent;
} 