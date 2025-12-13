import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plane, Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[100px]">
        <span className="text-3xl md:text-5xl font-bold text-white">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-white/70 text-sm mt-2">{label}</span>
    </div>
  );

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #6443F4 0%, #F94498 50%, #FF9327 100%)"
      }}
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Plane className="w-10 h-10 text-white" />
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            TRAVI
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Coming Soon
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-lg mx-auto">
            We're about to change the world of tourism forever. 
            Get ready for a revolutionary travel experience.
          </p>
        </div>

        <div className="flex justify-center gap-3 md:gap-6 py-8">
          <CountdownBox value={timeLeft.days} label="Days" />
          <CountdownBox value={timeLeft.hours} label="Hours" />
          <CountdownBox value={timeLeft.minutes} label="Minutes" />
          <CountdownBox value={timeLeft.seconds} label="Seconds" />
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
            className="h-12 px-6 bg-[#24103E] hover:bg-[#24103E]/90 text-white"
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
      </div>
    </div>
  );
}
