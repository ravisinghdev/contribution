'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  Image,
  Users,
  Heart,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🎓 Farewell-specific suggestions
  const suggestions = [
    { label: 'Farewell Memories', icon: Image },
    { label: 'Letters to Seniors', icon: Heart },
    { label: 'Photo & Video Gallery', icon: Image },
    { label: 'Organizing Committees', icon: Users },
    { label: 'Event Timeline', icon: Clock },
    { label: 'Highlights & Yearbook', icon: BookOpen },
  ];

  // Cmd+K / Ctrl+K shortcut focus
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      {/* Search Input Container */}
      <motion.div
        animate={{
          scale: focused ? 1.02 : 1,
          boxShadow: focused
            ? '0 6px 16px rgba(0, 0, 0, 0.1)'
            : '0 0 0 rgba(0, 0, 0, 0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'relative flex items-center rounded-full px-3 py-2 border text-sm backdrop-blur-md transition-all duration-200',
          focused
            ? 'border-primary/40 bg-background/90'
            : 'border-muted bg-muted/50 hover:bg-muted/70'
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search memories, people, letters..."
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground text-sm"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 rounded-full hover:bg-muted transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}

        {/* Shortcut hint */}
        <span
          className={cn(
            'hidden sm:flex items-center justify-center ml-2 rounded border text-[10px] px-1.5 py-[1px] text-muted-foreground transition-opacity',
            focused ? 'opacity-0' : 'opacity-100'
          )}
        >
          ⌘K
        </span>
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {focused && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full rounded-xl border bg-background/95 shadow-lg overflow-hidden backdrop-blur-lg"
          >
            {suggestions.map(({ label, icon: Icon }) => (
              <li
                key={label}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery(label);
                  setFocused(false);
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-muted/60 cursor-pointer text-sm transition-colors"
              >
                <Icon className="h-4 w-4 text-primary/80" />
                <span>{label}</span>
              </li>
            ))}

            {query && (
              <li className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/40 flex items-center justify-between">
                <span>
                  Press{' '}
                  <kbd className="mx-1 border px-1 py-[1px] rounded">Enter</kbd> to
                  search “{query}”
                </span>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
