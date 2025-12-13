import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Building2, MapPin, Lightbulb, MessageCircle } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import fullLogo from "@assets/Full_Logo_for_Dark_Background_1765637862936.png";
import mascot from "@assets/Mascot_for_Dark_Background_1765637862937.png";

export default function ComingSoon() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
      toast({
        title: "Success!",
        description: "You're on the list. We'll notify you when we launch!"
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden relative"
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
      `}</style>

      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="flex items-center justify-center mb-4">
          <img 
            src={fullLogo} 
            alt="Travi" 
            className="h-20 md:h-28 w-auto"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Coming Soon
          </h2>
          <p className="text-base md:text-xl text-white/90 max-w-lg mx-auto">
            We're about to change the world of tourism forever. 
            Get ready for a revolutionary travel experience.
          </p>
        </div>

        <div className="flex justify-center gap-2 md:gap-4 py-4">
          <CountdownBox value={timeLeft.days} label="Days" />
          <CountdownBox value={timeLeft.hours} label="Hours" />
          <CountdownBox value={timeLeft.minutes} label="Minutes" />
          <CountdownBox value={timeLeft.seconds} label="Seconds" />
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto py-4">
          <FeatureCard 
            icon={Building2} 
            title="Hotels" 
            description="Best stays in Dubai"
          />
          <FeatureCard 
            icon={MapPin} 
            title="Attractions" 
            description="Top places to visit"
          />
          <FeatureCard 
            icon={Lightbulb} 
            title="Tips" 
            description="Local insider guides"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-white border-0"
              data-testid="input-newsletter-email"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="h-12 px-6 bg-[#24103E] text-white border border-[#24103E]"
            data-testid="button-newsletter-subscribe"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Notify Me"
            )}
          </Button>
        </form>

        <p className="text-white/60 text-sm">
          Be the first to know when we launch. No spam, we promise.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            data-testid="link-social-instagram"
          >
            <SiInstagram className="w-5 h-5 text-white" />
          </a>
          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            data-testid="link-social-tiktok"
          >
            <SiTiktok className="w-5 h-5 text-white" />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            data-testid="link-social-youtube"
          >
            <SiYoutube className="w-5 h-5 text-white" />
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            data-testid="link-social-facebook"
          >
            <SiFacebook className="w-5 h-5 text-white" />
          </a>
        </div>

        <a 
          href="https://wa.me/971559627997" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#22c55e] text-white font-medium px-5 py-3 rounded-full transition-colors mt-2"
          data-testid="link-whatsapp-contact"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat with us on WhatsApp</span>
        </a>

        <div className="flex items-center justify-center gap-6 pt-4 text-white/50 text-xs">
          <span>Secure & Private</span>
          <span>|</span>
          <span>Made in Dubai</span>
          <span>|</span>
          <span>Launching 2025</span>
        </div>
      </div>
    </div>
  );
}
