/**
 * SearchInput Component
 * 
 * Reusable search input with autocomplete
 * - Debounced API calls
 * - Loading states
 * - Dropdown suggestions
 */

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleRouter";

interface Suggestion {
  text: string;
  displayText: string;
  type: string;
  url?: string;
  icon?: string;
  score: number;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className,
  autoFocus = false,
  showSuggestions = true,
}: SearchInputProps) {
  const { locale } = useLocale();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Debounced query for autocomplete
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  // Fetch autocomplete suggestions
  const { data: suggestions, isLoading } = useQuery<{ suggestions: Suggestion[] }>({
    queryKey: [`/api/search/autocomplete?q=${encodeURIComponent(debouncedQuery)}&locale=${locale}&limit=8`],
    enabled: showSuggestions && debouncedQuery.length >= 2 && isFocused,
  });
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isFocused || !suggestions?.suggestions) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const itemCount = suggestions.suggestions.length;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % itemCount);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + itemCount) % itemCount);
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selected = suggestions.suggestions[selectedIndex];
        if (selected.url) {
          window.location.href = selected.url;
        } else {
          onChange(selected.text);
          if (onSearch) {
            onSearch(selected.text);
          }
        }
        setIsFocused(false);
      } else if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, selectedIndex, suggestions, onChange, onSearch]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && value.trim()) {
      onSearch(value);
      setIsFocused(false);
    }
  };
  
  const showDropdown = isFocused && showSuggestions && suggestions?.suggestions && suggestions.suggestions.length > 0;
  
  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className={cn("relative", className)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-10 pr-10"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        ) : value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </form>
      
      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg overflow-hidden z-50"
        >
          {suggestions.suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.url) {
                  window.location.href = item.url;
                } else {
                  onChange(item.text);
                  if (onSearch) {
                    onSearch(item.text);
                  }
                }
                setIsFocused(false);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left",
                selectedIndex === index && "bg-accent"
              )}
            >
              {/* Icon */}
              {item.icon && (
                <span className="text-lg shrink-0">{item.icon}</span>
              )}
              
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {item.displayText}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {item.type}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
