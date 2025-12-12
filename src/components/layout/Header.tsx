'use client';

import React from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SearchBar } from '@/components/search/SearchBar';

interface HeaderProps {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onMenuClick, onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-border/50 flex-shrink-0 transition-all duration-300">
      <div className="flex items-center justify-between h-14 px-4 md:px-6 gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop toggle button */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 -ml-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>

        {/* Theme toggle */}
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
