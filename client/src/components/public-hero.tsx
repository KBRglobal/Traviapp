import { Link } from "wouter";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PublicHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "large" | "small";
}

export function PublicHero({
  title,
  subtitle,
  backgroundImage,
  breadcrumbs,
  children,
  className,
  size = "default",
}: PublicHeroProps) {
  const { isRTL, localePath } = useLocale();

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const heightClasses = {
    small: "min-h-[280px] md:min-h-[320px]",
    default: "min-h-[380px] md:min-h-[440px]",
    large: "min-h-[480px] md:min-h-[560px]",
  };

  return (
    <section
      className={cn(
        "relative w-full flex items-center justify-center overflow-hidden",
        heightClasses[size],
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
      data-testid="public-hero"
    >
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          data-testid="hero-background-image"
        />
      )}

      {/* Dark Gradient Overlay - ensures text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
        data-testid="hero-overlay"
      />

      {/* Brand Gradient Accent (subtle) */}
      <div className="absolute inset-0 bg-gradient-to-br from-travi-purple/20 via-transparent to-travi-pink/20" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px] py-12 md:py-16">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="flex items-center gap-2 mb-6 text-sm"
            aria-label="Breadcrumb"
            data-testid="hero-breadcrumbs"
          >
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronIcon
                    className="w-4 h-4 text-white/60"
                    aria-hidden="true"
                  />
                )}
                {crumb.href ? (
                  <Link
                    href={localePath(crumb.href)}
                    className="text-white/80 hover:text-white transition-colors"
                    data-testid={`breadcrumb-link-${index}`}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="text-white font-medium"
                    data-testid={`breadcrumb-current-${index}`}
                  >
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Headline */}
        <h1
          className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
          data-testid="hero-title"
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-8"
            data-testid="hero-subtitle"
          >
            {subtitle}
          </p>
        )}

        {/* CTA Buttons Slot */}
        {children && (
          <div
            className="flex flex-wrap items-center gap-4"
            data-testid="hero-cta-container"
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
