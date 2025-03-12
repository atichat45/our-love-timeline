'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface TimelineEventProps {
  memory: {
    id: string;
    title: string;
    description: string | null;
    date: Date;
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
  };
  isEven: boolean;
  importance: number;
}

const TimelineEvent = ({ memory, isEven, importance }: TimelineEventProps) => {
  // Determine size based on importance (1-5)
  const getSize = () => {
    switch (importance) {
      case 5: return 'w-16 h-16';
      case 4: return 'w-14 h-14';
      case 3: return 'w-12 h-12';
      case 2: return 'w-10 h-10';
      default: return 'w-8 h-8';
    }
  };

  // Determine color based on importance
  const getColor = () => {
    switch (importance) {
      case 5: return 'bg-pink-500';
      case 4: return 'bg-purple-500';
      case 3: return 'bg-indigo-500';
      case 2: return 'bg-blue-500';
      default: return 'bg-teal-500';
    }
  };

  const title = memory.timelineEvent?.title || memory.title;
  const description = memory.timelineEvent?.description || memory.description;
  const date = memory.timelineEvent?.date || memory.date;
  
  // Get the first image if available
  const firstImage = memory.mediaItems?.find(item => item.type === 'IMAGE');

  return (
    <div className="relative">
      {/* Dot on the timeline */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className={`absolute top-0 ${isEven ? '-right-5 md:-right-8' : '-left-5 md:-left-8'} ${getSize()} rounded-full ${getColor()} flex items-center justify-center z-10`}
        style={{ 
          transform: 'translateX(50%)',
          [isEven ? 'right' : 'left']: '0%'
        }}
      >
        <span className="text-white font-bold">
          {new Date(date).getFullYear()}
        </span>
      </motion.div>

      {/* Content card */}
      <div className={`bg-white rounded-lg shadow-lg p-4 ${isEven ? 'mr-6' : 'ml-6'}`}>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{formatDate(date)}</p>
        
        {firstImage && (
          <div className="relative w-full h-48 mb-3 overflow-hidden rounded-md">
            <Image
              src={firstImage.url}
              alt={firstImage.caption || title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {description && (
          <p className="text-gray-700">{description}</p>
        )}
      </div>
    </div>
  );
};

export default TimelineEvent; 