import { Link } from "wouter";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { MapPin, Camera, Building2, Utensils, Compass, Clock, Sun, Gift, Scale, Crown, Coffee, Send, Loader2 } from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiYoutube, SiTiktok } from "react-icons/si";
import mascotImg from "@assets/Mascot_for_Light_Background_1765497703861.png";
import { BackToTop } from "@/components/ui/back-to-top";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PublicFooter() {
  const { t, isRTL, localePath } = useLocale();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const exploreLinks = [
    { href: "/attractions", icon: Camera, label: t('nav.attractions') },
    { href: "/hotels", icon: Building2, label: t('nav.hotels') },
    { href: "/districts", icon: MapPin, label: t('nav.districts') },
    { href: "/dining", icon: Utensils, label: t('nav.dining') },
    { href: "/news", icon: Compass, label: t('nav.news') },
  ];

  const featuredGuides = [
    { href: "/dubai/free-things-to-do", icon: Gift, label: t('footer.freeThingsToDo') },
    { href: "/dubai/24-hours-open", icon: Coffee, label: t('footer.open24Hours') },
    { href: "/dubai/sheikh-mohammed-bin-rashid", icon: Crown, label: t('footer.tributeToSheikh') },
    { href: "/dubai/laws-for-tourists", icon: Scale, label: t('footer.lawsForTourists') },
  ];

  const toolLinks = [
    { href: "/tools-currency-converter", label: t('footer.currencyConverter') || "Currency Converter" },
    { href: "/tools-roi-calculator", label: t('footer.roiCalculator') || "ROI Calculator" },
    { href: "/tools-mortgage-calculator", label: t('footer.mortgageCalculator') || "Mortgage Calculator" },
    { href: "/glossary", label: t('footer.glossary') || "Glossary" },
  ];

  const socialLinks = [
    { href: "https://instagram.com/travidubai", icon: SiInstagram, label: "Instagram" },
    { href: "https://facebook.com/travidubai", icon: SiFacebook, label: "Facebook" },
    { href: "https://x.com/travidubai", icon: SiX, label: "X" },
    { href: "https://youtube.com/@travidubai", icon: SiYoutube, label: "YouTube" },
    { href: "https://tiktok.com/@travidubai", icon: SiTiktok, label: "TikTok" },
  ];

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
              <div>
                <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wide">
                  {t('footer.explore')}
                </h4>
                <ul className="space-y-3">
                  {exploreLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={link.href}>
                        <Link 
                          href={localePath(link.href)} 
                          className="group flex items-center gap-2 text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                          data-testid={`link-${link.href.replace('/', '')}`}
                        >
                          <IconComponent className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Featured Guides Column */}
              <div>
                <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wide">
                  {t('footer.featuredGuides')}
                </h4>
                <ul className="space-y-3">
                  {featuredGuides.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={link.href}>
                        <Link 
                          href={localePath(link.href)} 
                          className="group flex items-center gap-2 text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                        >
                          <IconComponent className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Tools Column */}
              <div>
                <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wide">
                  {t('footer.tools')}
                </h4>
                <ul className="space-y-3">
                  {toolLinks.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={localePath(link.href)} 
                        className="text-muted-foreground hover:text-travi-purple transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

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
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
