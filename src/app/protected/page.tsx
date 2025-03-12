'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useUser } from '@stackframe/stack';

export default function ProtectedPage() {
  // Get current user
  const user = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Handle unauthenticated state
  useEffect(() => {
    if (user === null) {
      setIsRedirecting(true);
      redirect('/handler/login');
    }
  }, [user]);
  
  if (isRedirecting || user === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">
            You need to be logged in to view this page. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Protected Page</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <p className="text-green-800">
            You are authenticated! This page can only be accessed by logged-in users.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Information</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="mb-2"><strong>ID:</strong> {user.id}</p>
            {/* Display other properties if they exist */}
            {typeof user === 'object' && 'email' in user && (
              <p className="mb-2"><strong>Email:</strong> {String(user.email)}</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
          >
            Back to Home
          </Link>
          
          <Link 
            href="/handler/account-settings"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-center"
          >
            Account Settings
          </Link>
          
          <Link 
            href="/handler/logout"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-center"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
} 