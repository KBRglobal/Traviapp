/**
 * SearchModal Component
 * 
 * Global search modal with keyboard shortcuts (Cmd+K / Ctrl+K)
 * - Autocomplete suggestions
 * - Recent searches
 * - Trending searches
 * - Keyboard navigation
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { cn } from "@/lib/utils";

interface Suggestion {
  text: string;
  displayText: string;
  type: "content" | "category" | "location" | "trending" | "recent";
  url?: string;
  icon?: string;
  score: number;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const { locale, localePath, isRTL } = useLocale();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fetch autocomplete suggestions
  const { data: suggestions } = useQuery<{ suggestions: Suggestion[] }>({
    queryKey: [`/api/search/autocomplete?q=${encodeURIComponent(query)}&locale=${locale}&limit=8`],
    enabled: query.length >= 2,
  });
  
  // Fetch trending searches
  const { data: trending } = useQuery<{ trending: string[] }>({
    queryKey: [`/api/search/trending?locale=${locale}&limit=5`],
    enabled: !query,
  });
  
  // Get recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  useEffect(() => {
    if (open) {
      const recent = localStorage.getItem('recentSearches');
      if (recent) {
        setRecentSearches(JSON.parse(recent).slice(0, 5));
      }
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const itemCount = suggestions?.suggestions.length || trending?.trending.length || recentSearches.length;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % itemCount);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + itemCount) % itemCount);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(selectedIndex);
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, suggestions, trending, recentSearches]);
  
  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    const recent = [...new Set([searchQuery, ...recentSearches])].slice(0, 5);
    setRecentSearches(recent);
    localStorage.setItem('recentSearches', JSON.stringify(recent));
  };
  
  // Handle selection
  const handleSelect = (index: number) => {
    if (suggestions?.suggestions[index]) {
      const item = suggestions.suggestions[index];
      if (item.url) {
        window.location.href = localePath(item.url);
      } else {
        setQuery(item.text);
        handleSearch(item.text);
      }
    } else if (trending?.trending[index]) {
      handleSearch(trending.trending[index]);
    } else if (recentSearches[index]) {
      handleSearch(recentSearches[index]);
    }
    onOpenChange(false);
  };
  
  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      window.location.href = localePath(`/search?q=${encodeURIComponent(searchQuery)}`);
      onOpenChange(false);
    }
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };
  
  const displayItems = suggestions?.suggestions || 
    (trending?.trending.map(t => ({ text: t, displayText: t, type: 'trending' as const, score: 0 })) || []) ||
    recentSearches.map(r => ({ text: r, displayText: r, type: 'recent' as const, score: 0 }));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search hotels, attractions, articles..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
        
        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {displayItems.length > 0 ? (
            <div className="py-2">
              {/* Section Header */}
              {!query && (
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  {trending && trending.trending.length > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      Recent
                    </>
                  )}
                </div>
              )}
              
              {/* Results List */}
              {displayItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left",
                    selectedIndex === index && "bg-accent"
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {item.icon ? (
                      <span className="text-lg">{item.icon}</span>
                    ) : item.type === 'trending' ? (
                      <TrendingUp className="w-4 h-4 text-primary" />
                    ) : item.type === 'recent' ? (
                      <Clock className="w-4 h-4 text-primary" />
                    ) : (
                      <Search className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {item.displayText}
                    </div>
                    {item.type !== 'recent' && item.type !== 'trending' && (
                      <div className="text-xs text-muted-foreground capitalize">
                        {item.type}
                      </div>
                    )}
                  </div>
                  
                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No suggestions found</p>
              <p className="text-xs mt-1">Press Enter to search</p>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Start typing to search</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>⏎ Select</span>
            <span>Esc Close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
