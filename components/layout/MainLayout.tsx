import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, User, Search } from 'lucide-react';
import Link from 'next/link';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Clean, minimal Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-600 transition-colors duration-300">
              <Briefcase className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span>SkillToJob</span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link href="/jobs" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" /> Find Jobs
            </Link>
            <Link href="/profile" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
              <User className="w-4 h-4" /> Profile
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:flex text-slate-600 hover:text-slate-900">
              Sign In
            </Button>
            <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-lg shadow-sm transition-all duration-300">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full container mx-auto px-4 md:px-8 py-8 md:py-12 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Footer Area */}
      <footer className="border-t bg-white py-10">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} SkillToJob. Crafted carefully with clean architecture.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
