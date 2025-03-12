'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Dynamically import components to avoid SSR issues with browser-only libraries
const Photos = dynamic(() => import('@/components/gallery/Gallery'), {
  ssr: false,
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Letters' | 'Photos' | 'Countdown'>('Photos');
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting for animations
  useEffect(() => {
    setIsMounted(true);
    
    // Apply background to body
    document.body.classList.add('bg-gradient-to-br', 'from-slate-50', 'to-slate-100');
    
    return () => {
      document.body.classList.remove('bg-gradient-to-br', 'from-slate-50', 'to-slate-100');
    };
  }, []);

  if (!isMounted) {
    // Return a simple loading state until client-side code runs
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  // Generate consistent user avatars to avoid hydration mismatches
  const userImages = [11, 12, 13, 14, 15]; // Use consistent indices
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Modern Minimal Header with subtle animation */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-6 flex justify-between items-center"
        >
          <div className="flex items-center">
            <span className="text-pink-500 mr-1.5">❤️</span>
            <span className="font-light tracking-tight text-slate-800">Love by Notes</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/handler/login" className="text-slate-600 hover:text-pink-500 transition-colors text-sm font-light">
              Login
            </Link>
            <Link 
              href="/handler/signup" 
              className="text-pink-500 hover:text-pink-600 transition-colors text-sm font-medium px-3 py-1.5 rounded-full border border-pink-100 hover:bg-pink-50"
            >
              Sign up
            </Link>
          </div>
        </motion.header>

        {/* Content Area with increased spacing and smoother animations */}
        <div className="py-12 md:py-20 flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Hero Section - Refined typography and animations */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-6 leading-tight tracking-tight">
                A place for your{" "}
                <span className="text-pink-500 font-normal relative">
                  love memories
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-200 origin-left"
                  />
                </span>
              </h1>
              
              <p className="text-slate-500 mb-10 text-lg font-light leading-relaxed">
                Create a unique space to track your relationship,
                write love letters and preserve every special moment.
              </p>
              
              <div className="mb-12">
                <Link
                  href="/handler/signup"
                  className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <span>Try it now</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
              
              {/* Social Proof - Enhanced with subtle animation */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-10"
              >
                <div className="flex -space-x-3 mb-3">
                  {userImages.map((i, index) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1 + (index * 0.1) }}
                      className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm relative"
                    >
                      <Image 
                        src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                        alt={`User ${i}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="text-slate-400 text-sm font-light">
                  <span className="text-pink-500">❤️</span> Loved by +12,000 couples
                </p>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Content Section - Enhanced with refined styling */}
          <div className="flex-1 flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col"
              style={{ boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)" }}
            >
              {/* App Interface Preview - Modern & minimal with better structure */}
              <div className="flex h-full">
                {/* Sidebar Navigation - Enhanced styling */}
                <div className="w-44 bg-gradient-to-b from-slate-50/80 to-white/50 py-8 hidden md:block border-r border-slate-100/50">
                  <div className="px-5 mb-8">
                    <div className="flex items-center">
                      <span className="text-pink-500 mr-1">❤️</span>
                      <span className="font-light text-slate-600 text-sm">Love by Notes</span>
                    </div>
                  </div>
                  
                  <nav className="mt-8 px-3">
                    {[
                      { name: 'Home', icon: '🏠' },
                      { name: 'Letters', icon: '✉️' },
                      { name: 'Photos', icon: '📸' },
                      { name: 'Countdown', icon: '⏱️' }
                    ].map(item => (
                      <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name as any)}
                        className={`flex items-center py-2.5 px-3 w-full text-left mb-2 rounded-lg transition-all duration-200 ${
                          activeTab === item.name 
                            ? 'bg-white text-pink-500 shadow-sm' 
                            : 'text-slate-500 hover:bg-white/70'
                        }`}
                      >
                        <span className="mr-3 text-sm">{item.icon}</span>
                        <span className="text-sm font-light">{item.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>
                
                {/* Main Content - Improved photo gallery section */}
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-light text-slate-700">You & Me</h2>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm relative">
                        <Image 
                          src="https://randomuser.me/api/portraits/men/32.jpg"
                          alt="Partner 1"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm relative">
                        <Image 
                          src="https://randomuser.me/api/portraits/women/44.jpg"
                          alt="Partner 2"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-base font-normal text-slate-500 mb-5">Photos</h3>
                  
                  {/* Photo Gallery Preview - Improved for better visual appearance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Photo Card with improved overlay */}
                    <motion.div 
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                      className="group relative aspect-square rounded-xl overflow-hidden shadow-sm isolate"
                    >
                      {/* Image */}
                      <Image 
                        src="https://images.unsplash.com/photo-1499342077439-1a804f518fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        alt="Sunset at the beach" 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                      
                      {/* Card info with better positioning */}
                      <div className="absolute top-0 left-0 p-3 z-10">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2.5 shadow-sm transform transition-all duration-300">
                          <div className="font-light text-sm text-slate-800">Our sunset picnic on the beach 🧺</div>
                          <div className="text-xs text-slate-500 mt-1">11/09/2023</div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Second Photo Card with improved overlay */}
                    <motion.div 
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                      className="group relative aspect-square rounded-xl overflow-hidden shadow-sm isolate"
                    >
                      {/* Image */}
                      <Image 
                        src="https://images.unsplash.com/photo-1469259943454-aa100abba749?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        alt="Art gallery visit" 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                      
                      {/* Card info with better positioning */}
                      <div className="absolute bottom-0 right-0 p-3 z-10">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2.5 shadow-sm transform transition-all duration-300">
                          <div className="text-xs text-slate-500">Dec. 28</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
