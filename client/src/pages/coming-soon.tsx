import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Building2, MapPin, Lightbulb, MessageCircle, Check, Globe, Shield, Award } from "lucide-react";
import { SiInstagram, SiTelegram, SiWhatsapp } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import fullLogo from "@assets/Full_Logo_for_Dark_Background_1765637862936.png";
import mascot from "@assets/Mascot_for_Dark_Background_1765637862937.png";

type Language = "en" | "ar";

const translations = {
  en: {
    comingSoon: "Coming Soon",
    tagline: "We're about to change the world of tourism forever. Get ready for a revolutionary travel experience.",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    hotels: "Hotels",
    hotelsDesc: "Best stays in Dubai",
    attractions: "Attractions",
    attractionsDesc: "Top places to visit",
    tips: "Tips",
    tipsDesc: "Local insider guides",
    emailPlaceholder: "Enter your email",
    notifyMe: "Notify Me",
    subscribed: "Subscribed!",
    noSpam: "Be the first to know when we launch. No spam, we promise.",
    whatsapp: "Chat with us on WhatsApp",
    joinWaitlist: "Join Waitlist",
    secure: "Secure & Private",
    madein: "Made in Dubai",
    launching: "Launching 2025",
    bestPrices: "Best Prices",
    invalidEmail: "Please enter a valid email address",
    telegram: "AI Assistant",
  },
  ar: {
    comingSoon: "قريباً",
    tagline: "نحن على وشك تغيير عالم السياحة للأبد. استعد لتجربة سفر ثورية.",
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثواني",
    hotels: "فنادق",
    hotelsDesc: "أفضل الإقامات في دبي",
    attractions: "معالم سياحية",
    attractionsDesc: "أفضل الأماكن للزيارة",
    tips: "نصائح",
    tipsDesc: "أدلة محلية من الداخل",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    notifyMe: "أبلغني",
    subscribed: "تم الاشتراك!",
    noSpam: "كن أول من يعلم عند إطلاقنا. لا رسائل مزعجة، نعدك.",
    whatsapp: "تحدث معنا عبر واتساب",
    joinWaitlist: "انضم لقائمة الانتظار",
    secure: "آمن وخاص",
    madein: "صنع في دبي",
    launching: "إطلاق 2025",
    bestPrices: "أفضل الأسعار",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    telegram: "مساعد ذكي",
  }
};

export default function ComingSoon() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const t = translations[language];
  const isRTL = language === "ar";

  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 14);
    launchDate.setHours(0, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError(t.invalidEmail);
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setEmailError(t.invalidEmail);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
      setIsSubscribed(true);
      toast({
        title: language === "en" ? "Success!" : "نجاح!",
        description: language === "en" 
          ? "You're on the list. We'll notify you when we launch!"
          : "أنت في القائمة. سنخبرك عند الإطلاق!"
      });
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Something went wrong. Please try again."
          : "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const form = document.getElementById("newsletter-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  };

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 md:p-5 min-w-[60px] md:min-w-[90px]">
        <span className="text-2xl md:text-4xl font-bold text-white">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-white/70 text-xs md:text-sm mt-2">{label}</span>
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description }: { icon: typeof Building2; title: string; description: string }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center hover-elevate transition-all duration-300">
      <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );

  const TrustBadge = ({ icon: Icon, text }: { icon: typeof Shield; text: string }) => (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
      <Icon className="w-4 h-4 text-white/80" />
      <span className="text-white/80 text-xs">{text}</span>
    </div>
  );

  return (
    <div 
      className={`min-h-screen flex flex-col p-4 md:p-6 pb-24 md:pb-6 overflow-hidden relative ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "linear-gradient(135deg, #6443F4 0%, #F94498 50%, #FF9327 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite"
      }}
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img 
            src={fullLogo} 
            alt="Travi" 
            className="h-12 md:h-16 w-auto"
          />
          <img 
            src={mascot} 
            alt="Travi Mascot" 
            className="h-16 md:h-24 w-auto"
            style={{ animation: "float 4s ease-in-out infinite" }}
          />
        </div>
        <button
          onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm transition-colors"
          data-testid="button-language-toggle"
        >
          <Globe className="w-4 h-4" />
          <span>{language === "en" ? "العربية" : "English"}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              {t.comingSoon}
            </h2>
            <p className="text-base md:text-xl text-white/90 max-w-lg mx-auto">
              {t.tagline}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <TrustBadge icon={Shield} text={t.secure} />
            <TrustBadge icon={Award} text={t.bestPrices} />
          </div>

          <div className="flex justify-center gap-2 md:gap-4 py-4">
            <CountdownBox value={timeLeft.days} label={t.days} />
            <CountdownBox value={timeLeft.hours} label={t.hours} />
            <CountdownBox value={timeLeft.minutes} label={t.minutes} />
            <CountdownBox value={timeLeft.seconds} label={t.seconds} />
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto py-4">
            <FeatureCard 
              icon={Building2} 
              title={t.hotels} 
              description={t.hotelsDesc}
            />
            <FeatureCard 
              icon={MapPin} 
              title={t.attractions} 
              description={t.attractionsDesc}
            />
            <FeatureCard 
              icon={Lightbulb} 
              title={t.tips} 
              description={t.tipsDesc}
            />
          </div>

          <form id="newsletter-form" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
              <Input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={handleEmailChange}
                className={`${isRTL ? "pr-10" : "pl-10"} h-12 bg-white border-0 ${emailError ? "ring-2 ring-red-500" : ""}`}
                data-testid="input-newsletter-email"
                required
              />
              {emailError && (
                <p className={`absolute ${isRTL ? "right-0" : "left-0"} -bottom-5 text-xs text-red-200`}>
                  {emailError}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || isSubscribed}
              className={`h-12 px-6 text-white border transition-all duration-300 ${
                isSubscribed 
                  ? "bg-green-500 border-green-500" 
                  : "bg-[#24103E] border-[#24103E]"
              }`}
              style={isSubscribed ? { animation: "successPulse 0.5s ease-in-out" } : undefined}
              data-testid="button-newsletter-subscribe"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSubscribed ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {t.subscribed}
                </span>
              ) : (
                t.notifyMe
              )}
            </Button>
          </form>

          <p className="text-white/60 text-sm mt-8">
            {t.noSpam}
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <a 
              href="https://instagram.com/travi_world" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              data-testid="link-social-instagram"
            >
              <SiInstagram className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://t.me/TraviAi_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              data-testid="link-social-telegram"
            >
              <SiTelegram className="w-5 h-5 text-white" />
            </a>
          </div>

          <a 
            href="https://wa.me/971559627997" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#22c55e] text-white font-medium px-5 py-3 rounded-full transition-colors mt-2"
            data-testid="link-whatsapp-contact"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.whatsapp}</span>
          </a>

          <div className="flex items-center justify-center gap-6 pt-4 text-white/50 text-xs">
            <span>{t.secure}</span>
            <span>|</span>
            <span>{t.madein}</span>
            <span>|</span>
            <span>{t.launching}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 p-3 flex items-center gap-3 z-50">
        <a 
          href="https://wa.me/971559627997" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium py-3 rounded-full"
          data-testid="link-whatsapp-mobile"
        >
          <SiWhatsapp className="w-5 h-5" />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={scrollToForm}
          className="flex-1 flex items-center justify-center gap-2 bg-[#24103E] text-white font-medium py-3 rounded-full"
          data-testid="button-join-waitlist-mobile"
        >
          <Mail className="w-5 h-5" />
          <span>{t.joinWaitlist}</span>
        </button>
      </div>
    </div>
  );
}
