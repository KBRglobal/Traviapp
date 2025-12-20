import { Link } from "wouter";
import { Logo } from "@/components/logo";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { MapPin, Camera, Building2, Utensils, Compass, Calculator, BookOpen, Globe, Mail, Phone, Clock, Sun } from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiYoutube, SiTiktok } from "react-icons/si";
import mascotImg from "@assets/Mascot_for_Light_Background_1765570034687.png";
import { BackToTop } from "@/components/ui/back-to-top";

export function PublicFooter() {
  const { t, isRTL, localePath } = useLocale();

  const exploreLinks = [
    { href: "/attractions", icon: Camera, label: t('nav.attractions') },
    { href: "/hotels", icon: Building2, label: t('nav.hotels') },
    { href: "/districts", icon: MapPin, label: t('nav.districts') },
    { href: "/dining", icon: Utensils, label: t('nav.dining') },
    { href: "/articles", icon: Compass, label: t('nav.articles') },
  ];

  const toolLinks = [
    { href: "/tools-currency-converter", label: t('footer.currencyConverter') || "Currency Converter" },
    { href: "/tools-roi-calculator", label: t('footer.roiCalculator') || "ROI Calculator" },
    { href: "/tools-mortgage-calculator", label: t('footer.mortgageCalculator') || "Mortgage Calculator" },
    { href: "/glossary", label: t('footer.glossary') || "Glossary" },
  ];

  const socialLinks = [
    { href: "#", icon: SiInstagram, label: "Instagram" },
    { href: "#", icon: SiFacebook, label: "Facebook" },
    { href: "#", icon: SiX, label: "X" },
    { href: "#", icon: SiYoutube, label: "YouTube" },
    { href: "#", icon: SiTiktok, label: "TikTok" },
  ];

  return (
    <footer className="relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"} data-testid="footer">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-purple-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950" />
      
      {/* Main Footer Content */}
      <div className="relative z-10 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top Section - Brand Story */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16 pb-16 border-b border-slate-200/50 dark:border-slate-800/50">
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
              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Your friendly guide to Dubai's wonders. From iconic landmarks to hidden gems, 
                we help you discover the magic of this extraordinary city.
              </p>
              
              {/* Dubai Live Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                  <span>Dubai, UAE</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#6C5CE7]" />
                  </div>
                  <span>GMT+4</span>
                </div>
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Explore Column */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide">
                  {t('footer.explore')}
                </h4>
                <ul className="space-y-3">
                  {exploreLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={link.href}>
                        <Link 
                          href={localePath(link.href)} 
                          className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#6C5CE7] dark:hover:text-[#6C5CE7] transition-colors text-sm"
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
                <h4 className="font-semibold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide">
                  {t('footer.tools')}
                </h4>
                <ul className="space-y-3">
                  {toolLinks.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={localePath(link.href)} 
                        className="text-slate-500 dark:text-slate-400 hover:text-[#6C5CE7] dark:hover:text-[#6C5CE7] transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide">
                  {t('footer.aboutUs')}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href={localePath("/about")} 
                      className="text-slate-500 dark:text-slate-400 hover:text-[#6C5CE7] dark:hover:text-[#6C5CE7] transition-colors text-sm"
                    >
                      About Travi
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={localePath("/contact")} 
                      className="text-slate-500 dark:text-slate-400 hover:text-[#6C5CE7] dark:hover:text-[#6C5CE7] transition-colors text-sm"
                    >
                      {t('footer.contactUs')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={localePath("/privacy")} 
                      className="text-slate-500 dark:text-slate-400 hover:text-[#6C5CE7] dark:hover:text-[#6C5CE7] transition-colors text-sm"
                    >
                      {t('footer.privacyPolicy')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={localePath("/terms")} 
                      className="text-slate-500 dark:text-slate-400 hover:text-[#6C5CE7] dark:hover:text-[#6C5CE7] transition-colors text-sm"
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
            <p className="text-sm text-slate-400 dark:text-slate-500 order-2 md:order-1">
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
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-gradient-to-br hover:from-[#6C5CE7] hover:to-[#EC4899] hover:text-white transition-all duration-300"
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
