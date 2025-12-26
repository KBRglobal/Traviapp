import { Link } from "wouter";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { MapPin, Camera, Building2, Utensils, Compass, Clock, Sun, Gift, Scale, Crown, Coffee, Send, Loader2, Circle, type LucideIcon } from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiYoutube, SiTiktok, type IconType } from "react-icons/si";
import mascotImg from "@assets/Mascot_for_Light_Background_1765497703861.png";
import { BackToTop } from "@/components/ui/back-to-top";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const lucideIconMap: Record<string, LucideIcon> = {
  Camera, Building2, MapPin, Utensils, Compass, Gift, Coffee, Crown, Scale
};

const socialIconMap: Record<string, IconType> = {
  SiInstagram, SiFacebook, SiX, SiYoutube, SiTiktok
};

function getLucideIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return Circle;
  return lucideIconMap[iconName] || Circle;
}

function getSocialIcon(iconName?: string | null): IconType | null {
  if (!iconName) return null;
  return socialIconMap[iconName] || null;
}

interface FooterLink {
  id: string;
  label: string;
  labelHe?: string | null;
  href: string;
  icon?: string | null;
  openInNewTab?: boolean;
  sortOrder: number;
}

interface FooterSection {
  id: string;
  title: string;
  titleHe?: string | null;
  slug: string;
  links: FooterLink[];
}

const fallbackSections: FooterSection[] = [
  {
    id: "explore",
    title: "Explore",
    titleHe: "גלה",
    slug: "explore",
    links: [
      { id: "1", label: "Attractions", labelHe: "אטרקציות", href: "/attractions", icon: "Camera", sortOrder: 1 },
      { id: "2", label: "Hotels", labelHe: "מלונות", href: "/hotels", icon: "Building2", sortOrder: 2 },
      { id: "3", label: "Districts", labelHe: "שכונות", href: "/districts", icon: "MapPin", sortOrder: 3 },
      { id: "4", label: "Dining", labelHe: "מסעדות", href: "/dining", icon: "Utensils", sortOrder: 4 },
      { id: "5", label: "News", labelHe: "חדשות", href: "/news", icon: "Compass", sortOrder: 5 },
    ]
  },
  {
    id: "guides",
    title: "Featured Guides",
    titleHe: "מדריכים מומלצים",
    slug: "guides",
    links: [
      { id: "6", label: "Free Things to Do", labelHe: "דברים בחינם", href: "/dubai/free-things-to-do", icon: "Gift", sortOrder: 1 },
      { id: "7", label: "Open 24 Hours", labelHe: "פתוח 24 שעות", href: "/dubai/24-hours-open", icon: "Coffee", sortOrder: 2 },
      { id: "8", label: "Tribute to Sheikh Mohammed", labelHe: "מחווה לשייח' מוחמד", href: "/dubai/sheikh-mohammed-bin-rashid", icon: "Crown", sortOrder: 3 },
      { id: "9", label: "Laws for Tourists", labelHe: "חוקים לתיירים", href: "/dubai/laws-for-tourists", icon: "Scale", sortOrder: 4 },
    ]
  },
  {
    id: "tools",
    title: "Tools",
    titleHe: "כלים",
    slug: "tools",
    links: [
      { id: "10", label: "Currency Converter", labelHe: "המרת מטבעות", href: "/tools-currency-converter", sortOrder: 1 },
      { id: "11", label: "ROI Calculator", labelHe: "מחשבון תשואה", href: "/tools-roi-calculator", sortOrder: 2 },
      { id: "12", label: "Mortgage Calculator", labelHe: "מחשבון משכנתא", href: "/tools-mortgage-calculator", sortOrder: 3 },
      { id: "13", label: "Glossary", labelHe: "מילון מונחים", href: "/glossary", sortOrder: 4 },
    ]
  },
  {
    id: "social",
    title: "Social",
    titleHe: "רשתות חברתיות",
    slug: "social",
    links: [
      { id: "14", label: "Instagram", href: "https://instagram.com/travidubai", icon: "SiInstagram", openInNewTab: true, sortOrder: 1 },
      { id: "15", label: "Facebook", href: "https://facebook.com/travidubai", icon: "SiFacebook", openInNewTab: true, sortOrder: 2 },
      { id: "16", label: "X", href: "https://x.com/travidubai", icon: "SiX", openInNewTab: true, sortOrder: 3 },
      { id: "17", label: "YouTube", href: "https://youtube.com/@travidubai", icon: "SiYoutube", openInNewTab: true, sortOrder: 4 },
      { id: "18", label: "TikTok", href: "https://tiktok.com/@travidubai", icon: "SiTiktok", openInNewTab: true, sortOrder: 5 },
    ]
  }
];

export function PublicFooter() {
  const { t, isRTL, localePath, locale } = useLocale();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: footerSections } = useQuery<FooterSection[]>({
    queryKey: ['/api/site-config/public/footer'],
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const sections = footerSections && footerSections.length > 0 ? footerSections : fallbackSections;
  
  const exploreSection = sections.find(s => s.slug === "explore");
  const guidesSection = sections.find(s => s.slug === "guides");
  const toolsSection = sections.find(s => s.slug === "tools");
  const socialSection = sections.find(s => s.slug === "social");

  const getLabel = (item: { label: string; labelHe?: string | null }) => {
    if (locale === 'he' && item.labelHe) return item.labelHe;
    return item.label;
  };

  const getSectionTitle = (section: FooterSection | undefined, fallbackKey: string) => {
    if (!section) return t(fallbackKey);
    if (locale === 'he' && section.titleHe) return section.titleHe;
    return section.title;
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Successfully subscribed!",
          description: data.message || "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      } else {
        toast({
          title: "Subscription failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Connection error",
        description: "Unable to connect. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"} data-testid="footer">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted via-background to-muted/30 dark:from-card dark:via-background dark:to-card/50" />
      
      {/* Main Footer Content */}
      <div className="relative z-10 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top Section - Brand Story */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16 pb-16 border-b border-border">
            {/* Brand Column */}
            <div className="lg:w-1/3">
              <div className="flex items-center gap-4 mb-6">
                <Logo variant="primary" height={40} />
                <img 
                  src={mascotImg} 
                  alt="Travi mascot" 
                  className="w-12 h-12 -ml-2"
                />
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your friendly guide to Dubai's wonders. From iconic landmarks to hidden gems, 
                we help you discover the magic of this extraordinary city.
              </p>
              
              {/* Dubai Live Info */}
              <div className="flex flex-wrap gap-4 text-sm mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-travi-orange/10 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-travi-orange" />
                  </div>
                  <span>Dubai, UAE</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-travi-purple/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-travi-purple" />
                  </div>
                  <span>GMT+4</span>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-card/50 rounded-lg p-4 border border-border">
                <h4 className="font-semibold text-foreground mb-2 text-sm">
                  {t('footer.newsletter') || "Subscribe to our newsletter"}
                </h4>
                <p className="text-muted-foreground text-xs mb-3">
                  {t('footer.newsletterDescription') || "Get the latest Dubai travel tips and updates."}
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={t('footer.emailPlaceholder') || "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-sm"
                    disabled={isSubmitting}
                    data-testid="input-newsletter-email"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={isSubmitting}
                    data-testid="button-newsletter-subscribe"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {/* Explore Column */}
              {exploreSection && (
                <div>
                  <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wide">
                    {getSectionTitle(exploreSection, 'footer.explore')}
                  </h4>
                  <ul className="space-y-3">
                    {exploreSection.links.map((link) => {
                      const IconComponent = getLucideIcon(link.icon);
                      return (
                        <li key={link.id}>
                          <Link 
                            href={localePath(link.href)} 
                            className="group flex items-center gap-2 text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                            data-testid={`link-${link.href.replace('/', '')}`}
                          >
                            <IconComponent className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                            {getLabel(link)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Featured Guides Column */}
              {guidesSection && (
                <div>
                  <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wide">
                    {getSectionTitle(guidesSection, 'footer.featuredGuides')}
                  </h4>
                  <ul className="space-y-3">
                    {guidesSection.links.map((link) => {
                      const IconComponent = getLucideIcon(link.icon);
                      return (
                        <li key={link.id}>
                          <Link 
                            href={localePath(link.href)} 
                            className="group flex items-center gap-2 text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                          >
                            <IconComponent className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                            {getLabel(link)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Tools Column */}
              {toolsSection && (
                <div>
                  <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wide">
                    {getSectionTitle(toolsSection, 'footer.tools')}
                  </h4>
                  <ul className="space-y-3">
                    {toolsSection.links.map((link) => (
                      <li key={link.id}>
                        <Link 
                          href={localePath(link.href)} 
                          className="text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                        >
                          {getLabel(link)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Company Column */}
              <div>
                <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wide">
                  {t('footer.aboutUs')}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href={localePath("/about")} 
                      className="text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                      data-testid="link-about"
                    >
                      {t('footer.aboutTravi') || "About Travi"}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={localePath("/contact")} 
                      className="text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                      data-testid="link-contact"
                    >
                      {t('footer.contactUs')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={localePath("/privacy")} 
                      className="text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                      data-testid="link-privacy"
                    >
                      {t('footer.privacyPolicy')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={localePath("/terms")} 
                      className="text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                      data-testid="link-terms"
                    >
                      {t('footer.termsOfService')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground order-2 md:order-1">
              {new Date().getFullYear()} Travi. {t('footer.allRightsReserved')}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 order-1 md:order-2">
              {socialSection?.links.map((social) => {
                const IconComponent = getSocialIcon(social.icon);
                if (!IconComponent) return null;
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target={social.openInNewTab ? "_blank" : undefined}
                    rel={social.openInNewTab ? "noopener noreferrer" : undefined}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-gradient-to-br hover:from-travi-purple hover:to-travi-pink hover:text-white transition-all duration-300"
                    aria-label={social.label}
                    data-testid={`social-${social.label.toLowerCase()}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}
