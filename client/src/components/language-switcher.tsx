import { useState } from "react";
import { useLocation } from "wouter";
import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LOCALES, RTL_LOCALES, type Locale } from "@shared/schema";
import { useLocale } from "@/lib/i18n/LocaleRouter";

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "icon-only";
  showFlag?: boolean;
  showNativeName?: boolean;
  tierFilter?: number[]; // Only show languages from specific tiers
  className?: string;
}

// Get flag emoji from locale code (17 Dubai/UAE focused languages)
const getFlag = (locale: Locale): string => {
  const flagMap: Record<string, string> = {
    // Tier 1 - Core
    en: "🇬🇧",   // English (UK flag for Dubai context)
    ar: "🇦🇪",   // Arabic (UAE flag)
    hi: "🇮🇳",   // Hindi (India)
    // Tier 2 - High ROI
    zh: "🇨🇳",   // Chinese
    ru: "🇷🇺",   // Russian
    ur: "🇵🇰",   // Urdu (Pakistan)
    fr: "🇫🇷",   // French
    // Tier 3 - Growing
    de: "🇩🇪",   // German
    fa: "🇮🇷",   // Persian (Iran)
    bn: "🇧🇩",   // Bengali (Bangladesh)
    fil: "🇵🇭",  // Filipino (Philippines)
    // Tier 4 - Niche
    es: "🇪🇸",   // Spanish
    tr: "🇹🇷",   // Turkish
    it: "🇮🇹",   // Italian
    ja: "🇯🇵",   // Japanese
    ko: "🇰🇷",   // Korean
    he: "🇮🇱",   // Hebrew (Israel)
  };
  return flagMap[locale] || "🌐";
};

// Extract path without locale prefix
function getPathWithoutLocale(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const locales = SUPPORTED_LOCALES.map((l) => l.code);

  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    return "/" + segments.slice(1).join("/") || "/";
  }
  return path;
}

export function LanguageSwitcher({
  variant = "default",
  showFlag = true,
  showNativeName = true,
  tierFilter,
  className = "",
}: LanguageSwitcherProps) {
  const [location, setLocation] = useLocation();
  const { locale: currentLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  // Filter locales based on tier if specified
  let locales = SUPPORTED_LOCALES;
  if (tierFilter && tierFilter.length > 0) {
    locales = SUPPORTED_LOCALES.filter((l) => tierFilter.includes(l.tier));
  }

  // Group locales by region for better UX
  const groupedLocales = locales.reduce(
    (acc, locale) => {
      if (!acc[locale.region]) {
        acc[locale.region] = [];
      }
      acc[locale.region].push(locale);
      return acc;
    },
    {} as Record<string, typeof locales>
  );

  const currentLocaleInfo = SUPPORTED_LOCALES.find((l) => l.code === currentLocale);

  const handleLanguageChange = (newLocale: Locale) => {
    setIsOpen(false);

    // Get path without current locale prefix
    const basePath = getPathWithoutLocale(location);

    // Create new URL with new locale prefix
    let newPath: string;
    if (newLocale === "en") {
      // English is default - no prefix
      newPath = basePath || "/";
    } else {
      newPath = `/${newLocale}${basePath === "/" ? "" : basePath}`;
    }

    // Save locale preference
    localStorage.setItem("i18nextLng", newLocale);

    // Update document direction for RTL languages
    document.documentElement.lang = newLocale;
    document.documentElement.dir = RTL_LOCALES.includes(newLocale) ? "rtl" : "ltr";

    // Navigate to new URL
    setLocation(newPath);
  };

  if (variant === "icon-only") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
          {Object.entries(groupedLocales).map(([region, regionLocales]) => (
            <div key={region}>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {region}
              </DropdownMenuLabel>
              {regionLocales.map((locale) => (
                <DropdownMenuItem
                  key={locale.code}
                  onClick={() => handleLanguageChange(locale.code)}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {showFlag && <span>{getFlag(locale.code)}</span>}
                    <span>{showNativeName ? locale.nativeName : locale.name}</span>
                  </span>
                  {currentLocale === locale.code && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "compact") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
            {showFlag && currentLocaleInfo && (
              <span>{getFlag(currentLocale)}</span>
            )}
            <span className="uppercase">{currentLocale}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale.code}
              onClick={() => handleLanguageChange(locale.code)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                {showFlag && <span>{getFlag(locale.code)}</span>}
                <span>{locale.nativeName}</span>
              </span>
              {currentLocale === locale.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          <Globe className="h-4 w-4" />
          {currentLocaleInfo && (
            <>
              {showFlag && <span>{getFlag(currentLocale)}</span>}
              <span>{showNativeName ? currentLocaleInfo.nativeName : currentLocaleInfo.name}</span>
            </>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-y-auto">
        {Object.entries(groupedLocales).map(([region, regionLocales]) => (
          <div key={region}>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {region}
            </DropdownMenuLabel>
            {regionLocales.map((locale) => (
              <DropdownMenuItem
                key={locale.code}
                onClick={() => handleLanguageChange(locale.code)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  {showFlag && <span className="text-lg">{getFlag(locale.code)}</span>}
                  <div className="flex flex-col">
                    <span className="font-medium">{locale.nativeName}</span>
                    {showNativeName && locale.nativeName !== locale.name && (
                      <span className="text-xs text-muted-foreground">{locale.name}</span>
                    )}
                  </div>
                </span>
                {currentLocale === locale.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple language selector for mobile
export function LanguageSelectorMobile({
  className = "",
}: {
  className?: string;
}) {
  const [location, setLocation] = useLocation();
  const { locale: currentLocale } = useLocale();

  const handleChange = (newLocale: Locale) => {
    const basePath = getPathWithoutLocale(location);

    let newPath: string;
    if (newLocale === "en") {
      newPath = basePath || "/";
    } else {
      newPath = `/${newLocale}${basePath === "/" ? "" : basePath}`;
    }

    localStorage.setItem("i18nextLng", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = RTL_LOCALES.includes(newLocale) ? "rtl" : "ltr";

    setLocation(newPath);
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => handleChange(e.target.value as Locale)}
      className={`bg-transparent border rounded px-2 py-1 text-sm ${className}`}
    >
      {SUPPORTED_LOCALES.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {getFlag(locale.code)} {locale.nativeName}
        </option>
      ))}
    </select>
  );
}
