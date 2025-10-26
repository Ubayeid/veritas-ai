'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">VeritasAI</h1>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-1">
              <Link 
                href="/dashboard" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/dashboard' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Legal Research
              </Link>
              <Link 
                href="/dashboard/unique" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/dashboard/unique' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Unique Features
              </Link>
                  <Link 
                    href="/trust-safety" 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === '/trust-safety' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Trust & Safety
                  </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}