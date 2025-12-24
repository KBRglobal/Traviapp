import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, ChevronDown, MapPin, Camera, Building2, Utensils, Sparkles, Compass, ShoppingBag } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher, LanguageSelectorMobile } from "./language-switcher";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import mascotImage from "@assets/Mascot_for_Dark_Background_1765497703861.png";

interface PublicNavProps {
  className?: string;
  variant?: "default" | "transparent";
  /** When variant is "transparent", specify if hero background is light or dark */
  transparentTone?: "light" | "dark";
  hideOnMobile?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  externalMobileMenuOpen?: boolean;
}

export function PublicNav({ 
  className = "", 
  variant = "default",
  transparentTone = "dark",
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
  
  // When transparent and not scrolled, use tone to determine text colors
  // Dark tone = white text (for dark hero backgrounds like photos)
  // Light tone = dark text (for light hero backgrounds like sky)
  const isDarkTone = transparentTone === "dark";
  const useWhiteText = isTransparent && !showGlassEffect && isDarkTone;
  const useDarkText = isTransparent && !showGlassEffect && !isDarkTone;

  return (
    <header className={className}>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hideOnMobile ? "hidden lg:block" : ""
        } ${
          showGlassEffect
            ? "bg-white/80 dark:bg-card/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
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
              variant={useWhiteText ? "dark-bg" : "primary"} 
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
                        ? useWhiteText
                          ? "bg-white/20 text-white"
                          : "bg-travi-purple/10 text-travi-purple"
                        : showGlassEffect || !isTransparent
                          ? "text-muted-foreground hover:text-travi-purple hover:bg-muted"
                          : useWhiteText
                            ? "text-white/90 hover:text-white hover:bg-white/10"
                            : "text-gray-700 hover:text-travi-purple hover:bg-gray-100/50"
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
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gradient-to-r from-travi-purple to-travi-pink text-white shadow-md shadow-travi-purple/25 hover:shadow-lg hover:shadow-travi-purple/30"
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
                      ? "border-border text-muted-foreground hover:bg-muted"
                      : useWhiteText
                        ? "border-white/30 text-white hover:bg-white/10"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100/50"
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
                      ? "text-muted-foreground hover:bg-muted"
                      : useWhiteText
                        ? "text-white hover:bg-white/10"
                        : "text-gray-700 hover:bg-gray-100/50"
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
                    ? "text-muted-foreground hover:bg-muted focus:ring-travi-purple" 
                    : useWhiteText
                      ? "text-white hover:bg-white/10 focus:ring-white/50"
                      : "text-gray-700 hover:bg-gray-100/50 focus:ring-travi-purple"
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
        className={`lg:hidden fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-[85%] max-w-[320px] z-[101] bg-background shadow-2xl transition-transform duration-300 ease-out ${
          mobileMenuOpen 
            ? "translate-x-0" 
            : isRTL ? "-translate-x-full" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Logo variant="primary" height={28} linkTo={localePath("/")} />
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={t("common.close") || "Close menu"}
            data-testid="button-close-mobile-menu"
          >
            <X className="w-5 h-5 text-muted-foreground" />
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
                      ? "bg-travi-purple/15 text-travi-purple"
                      : "text-foreground hover:bg-muted"
                  }`}
                  data-testid={`link-${link.href.slice(1)}-mobile`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active 
                      ? "bg-gradient-to-br from-travi-purple to-travi-pink text-white" 
                      : "bg-muted text-muted-foreground"
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
              className="mt-2 py-3.5 px-4 rounded-xl text-base font-medium bg-gradient-to-r from-travi-purple to-travi-pink text-white flex items-center gap-3 shadow-lg shadow-travi-purple/25"
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
          <div className="mt-6 pt-6 border-t border-border">
            <span className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("nav.language") || "Language"}
            </span>
            <div className="mt-3">
              <LanguageSelectorMobile className="w-full" />
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-center text-muted-foreground">
            {t("home.multiLanguageDesc") || "Read in your native language"}
          </p>
        </div>
      </nav>

      {/* Mobile Top Menu Button - Hamburger (visible on all pages) */}
      <button
        type="button"
        className={`lg:hidden fixed top-4 z-50 p-2 rounded-full bg-background/90 backdrop-blur-sm shadow-lg active:scale-95 transition-transform ${isRTL ? 'left-4' : 'right-4'}`}
        onClick={() => setMobileMenuOpen(true)}
        data-testid="button-mobile-menu-top"
        aria-label={t("nav.menu") || "Open menu"}
      >
        <Menu className="w-6 h-6 text-travi-purple" />
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
        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-travi-purple px-2 py-0.5 rounded-full shadow-md">
          {t("nav.menu") || "Menu"}
        </span>
      </button>
    </header>
  );
}
