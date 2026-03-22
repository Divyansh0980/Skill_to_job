import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, User, Search } from 'lucide-react';
import Link from 'next/link';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Clean, minimal Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary transition-colors duration-300">
              <Briefcase className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <span>SkillToJob</span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link href="/jobs" className="hover:text-foreground transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" /> Find Jobs
            </Link>
            <Link href="/profile" className="hover:text-foreground transition-colors flex items-center gap-2">
              <User className="w-4 h-4" /> Profile
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:flex text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300">
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
      <footer className="border-t border-border bg-background/50 py-10 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} SkillToJob. Crafted carefully with clean architecture.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground font-medium">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
