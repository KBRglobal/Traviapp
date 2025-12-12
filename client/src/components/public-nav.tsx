import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

interface PublicNavProps {
  className?: string;
}

export function PublicNav({ className = "" }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/hotels", label: "Hotels", testId: "link-hotels" },
    { href: "/attractions", label: "Attractions", testId: "link-attractions" },
    { href: "/dining", label: "Dining", testId: "link-dining" },
    { href: "/districts", label: "Districts", testId: "link-districts" },
    { href: "/transport", label: "Transport", testId: "link-transport" },
    { href: "/articles", label: "Articles", testId: "link-articles" },
  ];

  return (
    <header className={className}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />

            <div className="hidden md:flex items-center gap-6" role="navigation" aria-label="Primary">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-foreground/80 hover:text-primary font-medium transition-colors" 
                  data-testid={link.testId}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button 
              className="md:hidden p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
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

        {mobileMenuOpen && (
          <nav id="mobile-menu" className="md:hidden border-t bg-background p-4" aria-label="Mobile navigation">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="py-2 px-4 hover:bg-muted rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary" 
                  data-testid={`${link.testId}-mobile`} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </nav>
    </header>
  );
}
