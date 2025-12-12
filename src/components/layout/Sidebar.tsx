'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { modules } from '@/data/modules';
import { isModuleComplete, getProgress } from '@/lib/progress';
import { sortModulesByOrder } from '@/lib/modules';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const sortedModules = sortModulesByOrder(modules);
  const [completedModules, setCompletedModules] = React.useState<string[]>([]);

  React.useEffect(() => {
    const progress = getProgress();
    setCompletedModules(progress.completedModules);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-sidebar-bg/80 backdrop-blur-xl border-r border-border/50
          transform transition-all duration-300 ease-in-out flex-shrink-0
          lg:relative shadow-xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20 lg:w-20' : 'w-72 lg:w-72'}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            {isCollapsed ? (
              <Link
                href="/"
                className="flex items-center justify-center w-full"
                onClick={onClose}
                title="Pemrograman Piranti Bergerak - Universitas Terbuka"
              >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-sm">UT</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Link
                  href="/"
                  className="flex items-center gap-3 flex-1 min-w-0 group"
                  onClick={onClose}
                >
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-sm">UT</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-foreground text-sm">Menu</span>
                  </div>
                </Link>
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0 ml-1"
                  aria-label="Collapse sidebar"
                >
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Module List */}
          <nav className="flex-1 overflow-y-auto p-2">
            {!isCollapsed && (
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Modul Pembelajaran
              </h2>
            )}
            <ul className="space-y-0.5">
              {sortedModules.map((module) => {
                const isActive = pathname === `/modules/${module.slug}`;
                const isComplete = completedModules.includes(module.id);

                return (
                  <li key={module.id}>
                    <Link
                      href={`/modules/${module.slug}`}
                      onClick={onClose}
                      title={isCollapsed ? module.title : undefined}
                      className={`
                        flex items-center gap-2 px-2 py-2 rounded-md text-xs
                        transition-colors duration-200
                        ${isCollapsed ? 'justify-center' : ''}
                        ${isActive
                          ? 'bg-primary text-white'
                          : 'text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      {/* Completion indicator */}
                      <span
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                          flex-shrink-0 border-2
                          ${isComplete
                            ? 'bg-success border-success text-white'
                            : isActive
                              ? 'border-white/50'
                              : 'border-border'
                          }
                        `}
                        aria-label={isComplete ? 'Selesai' : 'Belum selesai'}
                      >
                        {isComplete ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span>{module.order}</span>
                        )}
                      </span>
                      {!isCollapsed && (
                        <span className="flex-1 leading-snug truncate">{module.title}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Progress Footer */}
          <div className="p-2.5 border-t border-border">
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className="relative w-9 h-9">
                  <svg className="w-9 h-9 transform -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - completedModules.length / modules.length)}`}
                      className="text-primary transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-foreground">
                      {Math.round((completedModules.length / modules.length) * 100)}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={onToggleCollapse}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  aria-label="Expand sidebar"
                >
                  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="text-[10px] text-muted-foreground mb-1.5 font-medium">
                  Progress: {completedModules.length} / {modules.length} modul
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </div >
      </aside >
    </>
  );
}

export default Sidebar;
