import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search } from "lucide-react";
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
  const [location] = useLocation();
  const { t, locale, localePath, isRTL } = useLocale();

  const navLinks = [
    { href: "/attractions", labelKey: "nav.attractions", testId: "link-attractions" },
    { href: "/hotels", labelKey: "nav.hotels", testId: "link-hotels" },
    { href: "/articles", labelKey: "nav.articles", testId: "link-news" },
    { href: "/districts", labelKey: "nav.districts", testId: "link-districts" },
    { href: "/dining", labelKey: "nav.dining", testId: "link-dining" },
    { href: "/dubai-off-plan-properties", labelKey: "nav.realEstate", testId: "link-off-plan" },
  ];

  const isTransparent = variant === "transparent";
  const normalizedLocation = location.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
  const isActive = (href: string) => normalizedLocation === href || normalizedLocation.startsWith(href + '/');

  return (
    <header className={className}>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent 
            ? "bg-transparent" 
            : "bg-background/95 backdrop-blur-md border-b border-border/40"
        }`} 
        data-testid="nav-header" 
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo 
              variant={isTransparent ? "dark-bg" : "primary"} 
              height={32} 
            />

            <div className="hidden lg:flex items-center gap-10" role="navigation" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={localePath(link.href)}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                    isActive(link.href) || isActive(localePath(link.href))
                      ? isTransparent
                        ? "text-white border-b-2 border-white pb-1"
                        : "text-primary border-b-2 border-primary pb-1"
                      : isTransparent
                        ? "text-white/90 hover:text-white"
                        : "text-foreground/70 hover:text-foreground"
                  }`}
                  data-testid={link.testId}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switcher - Desktop */}
              <div className="hidden md:block">
                <LanguageSwitcher
                  variant="compact"
                  tierFilter={[1, 2, 3, 4, 5]}
                  className={isTransparent ? "border-white/30 text-white hover:bg-white/10" : ""}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={isTransparent ? "text-white hover:bg-white/10" : ""}
                data-testid="button-search"
                aria-label="Search"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </Button>

              <button 
                className={`lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isTransparent 
                    ? "text-white focus:ring-white/50" 
                    : "text-foreground focus:ring-primary"
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

        {mobileMenuOpen && (
          <nav 
            id="mobile-menu" 
            className="lg:hidden border-t bg-background/95 backdrop-blur-md" 
            aria-label="Mobile navigation"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={localePath(link.href)}
                  className={`py-3 px-4 rounded-lg text-sm font-medium uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    isActive(link.href) || isActive(localePath(link.href))
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                  data-testid={`${link.testId}-mobile`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}

              {/* Language Switcher - Mobile */}
              <div className="mt-4 pt-4 border-t border-border/40">
                <span className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("nav.menu")}</span>
                <div className="px-4 mt-2">
                  <LanguageSelectorMobile className="w-full" />
                </div>
              </div>
            </div>
          </nav>
        )}
      </nav>
    </header>
  );
}
