import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { changeLanguage, getCurrentLocale } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "icon-only";
  showFlag?: boolean;
  showNativeName?: boolean;
  tierFilter?: number[]; // Only show languages from specific tiers
  className?: string;
}

// Get flag emoji from locale code
const getFlag = (locale: Locale): string => {
  const flagMap: Record<string, string> = {
    en: "🇺🇸",
    ar: "🇸🇦",
    hi: "🇮🇳",
    ru: "🇷🇺",
    zh: "🇨🇳",
    de: "🇩🇪",
    fr: "🇫🇷",
    es: "🇪🇸",
    it: "🇮🇹",
    pt: "🇵🇹",
    nl: "🇳🇱",
    pl: "🇵🇱",
    uk: "🇺🇦",
    ta: "🇮🇳",
    te: "🇮🇳",
    bn: "🇧🇩",
    mr: "🇮🇳",
    gu: "🇮🇳",
    ml: "🇮🇳",
    kn: "🇮🇳",
    pa: "🇮🇳",
    ur: "🇵🇰",
    si: "🇱🇰",
    ne: "🇳🇵",
    ja: "🇯🇵",
    ko: "🇰🇷",
    th: "🇹🇭",
    vi: "🇻🇳",
    id: "🇮🇩",
    ms: "🇲🇾",
    tl: "🇵🇭",
    "zh-TW": "🇹🇼",
    fa: "🇮🇷",
    tr: "🇹🇷",
    he: "🇮🇱",
    kk: "🇰🇿",
    uz: "🇺🇿",
    az: "🇦🇿",
    cs: "🇨🇿",
    el: "🇬🇷",
    sv: "🇸🇪",
    no: "🇳🇴",
    da: "🇩🇰",
    fi: "🇫🇮",
    hu: "🇭🇺",
    ro: "🇷🇴",
    sw: "🇰🇪",
    am: "🇪🇹",
  };
  return flagMap[locale] || "🌐";
};

export function LanguageSwitcher({
  variant = "default",
  showFlag = true,
  showNativeName = true,
  tierFilter,
  className = "",
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = getCurrentLocale();

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

  const handleLanguageChange = async (locale: Locale) => {
    await changeLanguage(locale);
    setIsOpen(false);

    // Update URL with new locale
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);

    // Check if current path already has a locale prefix
    const hasLocalePrefix = SUPPORTED_LOCALES.some((l) => l.code === pathParts[0]);

    let newPath: string;
    if (hasLocalePrefix) {
      // Replace existing locale
      pathParts[0] = locale;
      newPath = "/" + pathParts.join("/");
    } else {
      // Add locale prefix
      newPath = `/${locale}${currentPath}`;
    }

    // Use replaceState to update URL without reload
    window.history.replaceState({}, "", newPath);
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
  const currentLocale = getCurrentLocale();

  return (
    <select
      value={currentLocale}
      onChange={(e) => changeLanguage(e.target.value as Locale)}
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
