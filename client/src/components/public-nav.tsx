import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, ChevronDown, MapPin, Camera, Building2, Utensils, Sparkles, Compass, ShoppingBag } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher, LanguageSelectorMobile } from "./language-switcher";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import mascotImage from "@assets/Mascot_for_Dark_Background_1766314766064.png";

interface PublicNavProps {
  className?: string;
  variant?: "default" | "transparent";
  hideOnMobile?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  externalMobileMenuOpen?: boolean;
}

export function PublicNav({ 
  className = "", 
  variant = "default",
  hideOnMobile = false,
  onMobileMenuToggle,
  externalMobileMenuOpen
}: PublicNavProps) {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal
  const mobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;
  const setMobileMenuOpen = (value: boolean) => {
    setInternalMobileMenuOpen(value);
    onMobileMenuToggle?.(value);
  };
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
    { href: "/shopping", labelKey: "nav.shopping", icon: ShoppingBag },
    { href: "/news", labelKey: "nav.news", icon: Compass },
  ];

  const isTransparent = variant === "transparent";
  const showGlassEffect = isTransparent && scrolled;
  const normalizedLocation = location.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
  const isActive = (href: string) => normalizedLocation === href || normalizedLocation.startsWith(href + '/');

  return (
    <header className={className}>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hideOnMobile ? "hidden lg:block" : ""
        } ${
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

      </nav>

      {/* Mobile Menu Overlay - Outside of nav so it's always accessible */}
      <div 
        className={`lg:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Mobile Menu Drawer - Slides from right, always accessible */}
      <nav 
        id="mobile-menu"
        className={`lg:hidden fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-[85%] max-w-[320px] z-[101] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out ${
          mobileMenuOpen 
            ? "translate-x-0" 
            : isRTL ? "-translate-x-full" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <Logo variant="primary" height={28} linkTo={localePath("/")} />
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={t("common.close") || "Close menu"}
            data-testid="button-close-mobile-menu"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const active = isActive(link.href) || isActive(localePath(link.href));
              return (
                <Link
                  key={link.href}
                  href={localePath(link.href)}
                  className={`py-3.5 px-4 rounded-xl text-base font-medium transition-all flex items-center gap-3 ${
                    active
                      ? "bg-gradient-to-r from-[#6C5CE7]/15 to-[#EC4899]/15 text-[#6C5CE7] dark:text-[#A29BFE]"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  data-testid={`link-${link.href.slice(1)}-mobile`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active 
                      ? "bg-gradient-to-br from-[#6C5CE7] to-[#EC4899] text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span>{t(link.labelKey)}</span>
                </Link>
              );
            })}
            
            {/* Real Estate - Mobile (Highlighted) */}
            <Link
              href={localePath("/dubai-off-plan-properties")}
              className="mt-2 py-3.5 px-4 rounded-xl text-base font-medium bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] text-white flex items-center gap-3 shadow-lg shadow-purple-500/25"
              data-testid="link-off-plan-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span>{t("nav.realEstate")}</span>
            </Link>
          </div>

          {/* Language Section */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t("nav.language") || "Language"}
            </span>
            <div className="mt-3">
              <LanguageSelectorMobile className="w-full" />
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs text-center text-slate-400">
            {t("home.multiLanguageDesc") || "Read in your native language"}
          </p>
        </div>
      </nav>

      {/* Mobile Top Menu Button - Hamburger (visible on all pages) */}
      <button
        type="button"
        className={`lg:hidden fixed top-4 z-50 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg active:scale-95 transition-transform ${isRTL ? 'left-4' : 'right-4'}`}
        onClick={() => setMobileMenuOpen(true)}
        data-testid="button-mobile-menu-top"
        aria-label={t("nav.menu") || "Open menu"}
      >
        <Menu className="w-6 h-6 text-[#6C5CE7]" />
      </button>

      {/* Mobile Menu Trigger - Duck Mascot (visible on all pages) */}
      <button
        type="button"
        className={`lg:hidden fixed bottom-6 z-50 flex flex-col items-center gap-0.5 ${isRTL ? 'left-4' : 'right-4'}`}
        onClick={() => setMobileMenuOpen(true)}
        data-testid="button-mobile-menu-mascot"
        aria-label={t("nav.menu") || "Open menu"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
      >
        {/* Duck Mascot - no frame */}
        <img 
          src={mascotImage} 
          alt="Travi"
          className="w-16 h-16 drop-shadow-xl active:scale-95 transition-transform"
          draggable={false}
        />
        
        {/* MENU Text below duck - purple pill for visibility */}
        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-[#6C5CE7] px-2 py-0.5 rounded-full shadow-md">
          {t("nav.menu") || "Menu"}
        </span>
      </button>
    </header>
  );
}
