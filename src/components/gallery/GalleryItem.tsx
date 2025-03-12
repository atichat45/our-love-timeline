'use client';

import Image from 'next/image';

interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption: string | null;
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
}

interface GalleryItemProps {
  media: Media;
  memory: Memory;
}

const GalleryItem = ({ media, memory }: GalleryItemProps) => {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      {media.type === 'IMAGE' ? (
        <div className="relative h-64 w-full">
          <Image
            src={media.url}
            alt={media.caption || memory.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="relative h-64 w-full">
          <video 
            src={media.url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-lg font-semibold truncate">{memory.title}</h3>
        {memory.location && (
          <p className="text-sm truncate">
            <span className="inline-block mr-1">📍</span>
            {memory.location.name}
          </p>
        )}
        {media.caption && (
          <p className="text-sm mt-1 truncate">{media.caption}</p>
        )}
      </div>
    </div>
  );
};

export default GalleryItem; 