import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, ChevronDown, MapPin, Camera, Building2, Utensils, Sparkles, Compass } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher, LanguageSelectorMobile } from "./language-switcher";
import { useLocale } from "@/lib/i18n/LocaleRouter";

interface PublicNavProps {
  className?: string;
  variant?: "default" | "transparent";
}

export function PublicNav({ className = "", variant = "default" }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { t, localePath, isRTL } = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/attractions", labelKey: "nav.attractions", icon: Camera },
    { href: "/hotels", labelKey: "nav.hotels", icon: Building2 },
    { href: "/districts", labelKey: "nav.districts", icon: MapPin },
    { href: "/dining", labelKey: "nav.dining", icon: Utensils },
    { href: "/articles", labelKey: "nav.articles", icon: Compass },
  ];

  const isTransparent = variant === "transparent";
  const showGlassEffect = isTransparent && scrolled;
  const normalizedLocation = location.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
  const isActive = (href: string) => normalizedLocation === href || normalizedLocation.startsWith(href + '/');

  return (
    <header className={className}>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showGlassEffect
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-slate-200/20 dark:shadow-slate-900/30"
            : isTransparent 
              ? "bg-transparent" 
              : "bg-background/95 backdrop-blur-md border-b border-border/40"
        }`} 
        data-testid="nav-header" 
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Logo 
              variant={isTransparent && !scrolled ? "dark-bg" : "primary"} 
              height={32}
              linkTo={localePath("/")}
            />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Primary">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const active = isActive(link.href) || isActive(localePath(link.href));
                return (
                  <Link
                    key={link.href}
                    href={localePath(link.href)}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      active
                        ? showGlassEffect || !isTransparent
                          ? "bg-gradient-to-r from-[#6C5CE7]/10 to-[#EC4899]/10 text-[#6C5CE7]"
                          : "bg-white/20 text-white"
                        : showGlassEffect || !isTransparent
                          ? "text-slate-600 hover:text-[#6C5CE7] hover:bg-slate-100/80"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                    data-testid={`link-${link.href.slice(1)}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {t(link.labelKey)}
                  </Link>
                );
              })}
              
              {/* Real Estate Link - Highlighted */}
              <Link
                href={localePath("/dubai-off-plan-properties")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  showGlassEffect || !isTransparent
                    ? "bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] text-white shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/30"
                    : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                }`}
                data-testid="link-off-plan"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t("nav.realEstate")}
                </span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher - Desktop */}
              <div className="hidden md:block">
                <LanguageSwitcher
                  variant="compact"
                  tierFilter={[1, 2, 3, 4, 5]}
                  className={`rounded-full ${
                    showGlassEffect || !isTransparent
                      ? "border-slate-200 text-slate-600 hover:bg-slate-100"
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                />
              </div>

              {/* Search Button */}
              <Link href="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${
                    showGlassEffect || !isTransparent
                      ? "text-slate-600 hover:bg-slate-100"
                      : "text-white hover:bg-white/10"
                  }`}
                  data-testid="button-search-nav"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" aria-hidden="true" />
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className={`lg:hidden p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  showGlassEffect || !isTransparent
                    ? "text-slate-600 hover:bg-slate-100 focus:ring-[#6C5CE7]" 
                    : "text-white hover:bg-white/10 focus:ring-white/50"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu" 
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav 
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50" 
            aria-label="Mobile navigation"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const active = isActive(link.href) || isActive(localePath(link.href));
                return (
                  <Link
                    key={link.href}
                    href={localePath(link.href)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                      active
                        ? "bg-gradient-to-r from-[#6C5CE7]/10 to-[#EC4899]/10 text-[#6C5CE7]"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    data-testid={`link-${link.href.slice(1)}-mobile`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    {t(link.labelKey)}
                  </Link>
                );
              })}
              
              {/* Real Estate - Mobile */}
              <Link
                href={localePath("/dubai-off-plan-properties")}
                className="py-3 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] text-white flex items-center gap-3 mt-2"
                data-testid="link-off-plan-mobile"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="w-5 h-5" />
                {t("nav.realEstate")}
              </Link>

              {/* Language Switcher - Mobile */}
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <span className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wide">{t("nav.language") || "Language"}</span>
                <div className="px-4 mt-3">
                  <LanguageSelectorMobile className="w-full" />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </nav>
    </header>
  );
}
