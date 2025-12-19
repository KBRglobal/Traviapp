import { useState } from "react";
import { 
  Building2, Home, TrendingUp, MapPin, DollarSign, 
  Briefcase, Globe, Shield, Clock, CheckCircle2, ChevronDown,
  Phone, Mail, User, X, ArrowRight, Landmark, CreditCard,
  FileText, Sparkles, Users, Palmtree, Waves, Mountain
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QUICK_INFO = [
  { icon: DollarSign, label: "0% Property Tax" },
  { icon: Home, label: "Freehold Ownership" },
  { icon: TrendingUp, label: "6-8% ROI" },
  { icon: Building2, label: "40+ Free Zones" },
  { icon: CreditCard, label: "Multi-Currency" },
];

const PROPERTY_TYPES = [
  {
    icon: Building2,
    title: "Luxury Apartments",
    areas: "Downtown, Marina, Business Bay",
    price: "From AED 1M",
    description: "Studios to penthouses",
  },
  {
    icon: Home,
    title: "Villas & Townhouses",
    areas: "Palm Jumeirah, Arabian Ranches, Damac",
    price: "From AED 2M",
    description: "Family homes with gardens",
  },
  {
    icon: Landmark,
    title: "Off-Plan Developments",
    areas: "Flexible payment plans, pre-launch deals",
    price: "From AED 500K",
    description: "High ROI potential",
  },
  {
    icon: Briefcase,
    title: "Investment Properties",
    areas: "Ready rentals, high-yield opportunities",
    price: "From AED 400K",
    description: "Immediate income",
  },
];

const INFO_GRID = [
  { icon: DollarSign, title: "Taxation", value: "0% tax", sub: "Property, Capital, Rental" },
  { icon: Home, title: "Ownership", value: "Freehold", sub: "for foreign buyers" },
  { icon: TrendingUp, title: "ROI", value: "6-8%", sub: "annual rental yields" },
  { icon: Building2, title: "Zones", value: "40+", sub: "freehold areas" },
  { icon: Users, title: "Visa", value: "2-10 yr", sub: "residency for buyers" },
  { icon: Globe, title: "Currency", value: "AED, USD", sub: "EUR, GBP accepted" },
  { icon: FileText, title: "Process", value: "DLD", sub: "secure registry" },
  { icon: Clock, title: "Timeline", value: "30-60", sub: "days to complete" },
];

const AREAS = [
  {
    id: "downtown",
    name: "Downtown Dubai",
    description: "Burj Khalifa area, luxury living, world-class amenities",
    price: "From AED 1.2M",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    icon: Building2,
  },
  {
    id: "marina",
    name: "Dubai Marina",
    description: "Waterfront apartments, Marina Walk, yacht lifestyle",
    price: "From AED 900K",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
    icon: Waves,
  },
  {
    id: "palm",
    name: "Palm Jumeirah",
    description: "Beachfront villas, private beaches, iconic island living",
    price: "From AED 3.5M",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600&h=400&fit=crop",
    icon: Palmtree,
  },
  {
    id: "arabian-ranches",
    name: "Arabian Ranches",
    description: "Family villas, golf course, parks, schools nearby",
    price: "From AED 2M",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    icon: Home,
  },
  {
    id: "business-bay",
    name: "Business Bay",
    description: "Canal views, business district, investment hotspot",
    price: "From AED 800K",
    image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&h=400&fit=crop",
    icon: Briefcase,
  },
  {
    id: "jvc",
    name: "Jumeirah Village Circle",
    description: "Affordable family living, parks, high rental yields",
    price: "From AED 500K",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    icon: Users,
  },
  {
    id: "dubai-hills",
    name: "Dubai Hills Estate",
    description: "Luxury villas, golf course, modern community",
    price: "From AED 1.8M",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    icon: Mountain,
  },
  {
    id: "dubai-south",
    name: "Dubai South (Expo Area)",
    description: "Future growth zone, affordable, near Expo City",
    price: "From AED 400K",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&h=400&fit=crop",
    icon: Sparkles,
  },
];

const BENEFITS = [
  {
    title: "0% Tax Environment",
    description: "No property tax, no capital gains tax, no inheritance tax, no rental income tax",
  },
  {
    title: "High Rental Yields",
    description: "Average 6-8% annual ROI, significantly higher than major global cities",
  },
  {
    title: "Freehold Ownership for Foreigners",
    description: "40+ designated areas allow full ownership rights with no restrictions",
  },
  {
    title: "Residency Visa Benefits",
    description: "AED 750K+ property = 2-year visa | AED 2M+ = 10-year Golden Visa for family",
  },
  {
    title: "Strategic Global Location",
    description: "8-hour flight radius covers 3 billion people across Europe, Asia, Africa",
  },
  {
    title: "Transparent Legal Framework",
    description: "Dubai Land Department blockchain registry ensures secure, clear property titles",
  },
];

const BUYING_STEPS = [
  { step: 1, title: "Choose Your Property", description: "Browse areas, view properties, select based on budget and goals" },
  { step: 2, title: "Reserve & Due Diligence", description: "Pay 10% deposit, verify title with Dubai Land Department" },
  { step: 3, title: "Sign Sales Agreement", description: "Finalize terms, payment schedule, handover dates" },
  { step: 4, title: "Register with DLD", description: "Pay 4% DLD transfer fee + registration" },
  { step: 5, title: "Receive Title Deed", description: "Property ownership transferred, visa application begins" },
];

const FAQS = [
  {
    question: "Can foreigners buy property in Dubai?",
    answer: "Yes, foreign nationals can buy freehold property in over 40 designated areas across Dubai, with full ownership rights including the ability to sell, lease, or mortgage without restrictions. Freehold areas include Dubai Marina, Downtown Dubai, Palm Jumeirah, Business Bay, Jumeirah Village Circle (JVC), Dubai Hills Estate, Arabian Ranches, and many other communities. Property buyers investing AED 750,000+ qualify for 2-year renewable residency visas, while AED 2 million+ investments qualify for 10-year Golden Visas.",
  },
  {
    question: "How much does it cost to buy property in Dubai?",
    answer: "Property prices in Dubai vary widely. Studios in affordable areas start from AED 300,000-400,000. One-bedroom apartments in mid-range communities range AED 500,000-800,000. Premium area apartments cost AED 1.2M-3M. Villas start from AED 1.5M in communities like Dubai South, rising to AED 3-8M in Arabian Ranches or Dubai Hills. Additional costs include 4% DLD transfer fee, 2% agent fee, and AED 5,000-15,000 for legal fees.",
  },
  {
    question: "What are the taxes on property in Dubai?",
    answer: "Dubai offers ZERO property tax, ZERO capital gains tax, ZERO inheritance tax, and ZERO income tax on rental earnings. The only mandatory fees are the 4% DLD transfer fee at purchase and annual service charges (maintenance fees) ranging AED 5-25 per square foot. Residential properties are exempt from VAT.",
  },
  {
    question: "Can I get a residency visa by buying property?",
    answer: "Yes! AED 750,000+ property investment qualifies for a 2-year renewable residency visa. AED 2 million+ investments grant 10-year Golden Visas covering the investor, spouse, children, and domestic helpers. The visa allows you to sponsor family, open bank accounts, obtain a driving license, and travel freely. You only need to visit UAE once every 180 days (2-year visa) or once every 12 months (Golden Visa) to maintain validity.",
  },
  {
    question: "What is the buying process for property in Dubai?",
    answer: "The process typically takes 30-60 days: 1) Property search & selection (1-2 weeks), 2) Pay 10% deposit and sign MOU (1-3 days), 3) Due diligence & title verification (1 week), 4) Sign Sales & Purchase Agreement (1 week), 5) Payment or mortgage arrangement (2-4 weeks), 6) Transfer at Dubai Land Department and receive Title Deed (1 day).",
  },
  {
    question: "What are the best areas to buy property in Dubai?",
    answer: "For high rental yields (6-9% ROI): JVC, Dubai Sports City, International City. For luxury living: Downtown Dubai, Palm Jumeirah, Emirates Hills, Dubai Marina. For families: Arabian Ranches, Dubai Hills Estate, The Springs. For investment growth: Dubai South, Dubai Creek Harbour, Mohammed bin Rashid City.",
  },
];

function ContactPopup({ 
  open, 
  onOpenChange, 
  inquiry 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  inquiry?: string;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: inquiry || "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contact Thrivestate</DialogTitle>
          <DialogDescription>
            Get expert guidance on Dubai real estate investment
          </DialogDescription>
        </DialogHeader>
        
        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              A Thrivestate expert will contact you within 24 hours.
            </p>
            <Button 
              className="mt-6" 
              onClick={() => {
                setSubmitted(false);
                onOpenChange(false);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background"
                  data-testid="input-contact-name"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background"
                  data-testid="input-contact-email"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background"
                  data-testid="input-contact-phone"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block">Message (Optional)</label>
              <textarea
                placeholder="Tell us about your property interests..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border bg-background resize-none"
                data-testid="input-contact-message"
              />
            </div>
            
            <Button type="submit" className="w-full" size="lg" data-testid="button-contact-submit">
              <Phone className="w-4 h-4 mr-2" />
              Contact Expert
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              We respect your privacy. Your data will only be used to contact you.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function PublicRealEstate() {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactInquiry, setContactInquiry] = useState("");
  const [showFullIntro, setShowFullIntro] = useState(false);

  useDocumentMeta({
    title: "Buy Property in Dubai: Real Estate Guide 2024 | Travi",
    description: "Discover Dubai real estate opportunities. Apartments, villas, investment properties. 0% tax, high ROI, freehold zones. Expert guidance from Thrivestate.",
    ogTitle: "Dubai Real Estate Guide | Travi",
    ogDescription: "Discover Dubai real estate opportunities. 0% tax, high ROI, freehold ownership.",
    ogType: "website",
  });

  const openContactWith = (inquiry: string) => {
    setContactInquiry(inquiry);
    setContactOpen(true);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <PublicNav />
      
      <ContactPopup 
        open={contactOpen} 
        onOpenChange={setContactOpen} 
        inquiry={contactInquiry}
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
            alt="Dubai Downtown skyline with Burj Khalifa and luxury real estate towers at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-6 text-sm px-4 py-1.5">
            Powered by Thrivestate
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            Dubai Real Estate
          </h1>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-10 font-light max-w-3xl mx-auto">
            Your Gateway to Tax-Free Property Investment
          </h2>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full shadow-2xl"
            onClick={() => openContactWith("")}
            data-testid="button-hero-contact"
          >
            <Phone className="w-5 h-5 mr-2" />
            Contact Our Experts
          </Button>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              0% property tax
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              High ROI
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Freehold ownership
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Expert guidance
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-primary text-primary-foreground py-4 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-6 md:gap-10 overflow-x-auto no-scrollbar">
            {QUICK_INFO.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2 shrink-0">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Brief Intro */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              Dubai real estate offers international investors tax-free property ownership with high rental yields (6-8% annually), freehold ownership rights for foreigners in designated areas, and residency visa opportunities for property buyers. The market features luxury apartments in Downtown Dubai, waterfront villas in Palm Jumeirah, and affordable studios in emerging neighborhoods.
            </p>
            
            {showFullIntro && (
              <div className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed animate-in fade-in duration-300">
                <p className="mb-4">
                  Dubai's real estate market has evolved into one of the world's most attractive property investment destinations, driven by 0% property tax, 0% capital gains tax, and 0% income tax on rental earnings. The Dubai Land Department (DLD) maintains transparent property records with secure blockchain-based registration.
                </p>
                <p className="mb-4">
                  Foreign nationals can purchase freehold properties in over 40 designated areas including Dubai Marina, Downtown Dubai, Palm Jumeirah, and Dubai Hills Estate. Property buyers investing AED 750,000+ qualify for 2-year renewable residency visas, while AED 2 million+ investments grant 10-year Golden Visas.
                </p>
                <p>
                  Average rental yields range 6-8% annually, significantly higher than London (3-4%), New York (4-5%), or Singapore (3-4%).
                </p>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              className="mt-6"
              onClick={() => setShowFullIntro(!showFullIntro)}
              data-testid="button-toggle-intro"
            >
              {showFullIntro ? "Show Less" : "Read More About Dubai Real Estate"}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFullIntro ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </section>

        {/* Property Types */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Property Options</h2>
              <p className="text-muted-foreground text-lg">Find the perfect investment for your goals</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROPERTY_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.title}
                    className="p-6 hover:shadow-lg transition-shadow"
                    data-testid={`card-property-type-${type.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-1">{type.title}</h3>
                        <p className="text-muted-foreground text-sm mb-1">{type.areas}</p>
                        <p className="text-primary font-semibold">{type.price}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => openContactWith(`Interested in ${type.title}`)}
                          data-testid={`button-inquire-${type.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Inquire
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center mt-10">
              <p className="text-muted-foreground mb-4">Not sure what's right for you?</p>
              <Button onClick={() => openContactWith("")} data-testid="button-contact-expert">
                <Phone className="w-4 h-4 mr-2" />
                Contact Thrivestate Experts
              </Button>
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Essential Information</h2>
              <p className="text-muted-foreground text-lg">Everything you need to know at a glance</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INFO_GRID.map((item) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.title}
                    className="p-5 text-center"
                    data-testid={`card-info-${item.title.toLowerCase()}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
                    <p className="text-2xl font-bold text-primary">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Areas */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Dubai Real Estate Areas</h2>
              <p className="text-muted-foreground text-lg">Prime locations for investment and living</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {AREAS.map((area) => {
                const Icon = area.icon;
                return (
                  <Card 
                    key={area.id}
                    className="group overflow-hidden"
                    data-testid={`card-area-${area.id}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={area.image} 
                        alt={area.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-white" />
                          <h3 className="font-bold text-white">{area.name}</h3>
                        </div>
                        <p className="text-white/80 text-xs line-clamp-2">{area.description}</p>
                        <p className="text-primary font-semibold text-sm mt-2">{area.price}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => openContactWith(`Interested in ${area.name}`)}
                        data-testid={`button-contact-${area.id}`}
                      >
                        <Phone className="w-3.5 h-3.5 mr-2" />
                        Contact About {area.name.split(' ')[0]}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Invest in Dubai Real Estate</h2>
              <p className="text-muted-foreground text-lg">Key advantages for international investors</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BENEFITS.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4"
                  data-testid={`benefit-${index}`}
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Buying Process */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Buy Property in Dubai</h2>
              <p className="text-muted-foreground text-lg">Simple 5-step process</p>
            </div>
            
            <div className="space-y-6">
              {BUYING_STEPS.map((step, index) => (
                <div 
                  key={step.step}
                  className="flex items-start gap-6"
                  data-testid={`step-${step.step}`}
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    {index === BUYING_STEPS.length - 1 && (
                      <p className="text-sm text-primary mt-2 font-medium">
                        Thrivestate supports visa process
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Let Thrivestate guide you through every step</p>
              <Button 
                size="lg" 
                onClick={() => openContactWith("I want to start my property journey")}
                data-testid="button-start-journey"
              >
                <Phone className="w-4 h-4 mr-2" />
                Start Your Property Journey
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">Everything you need to know about Dubai property</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left" data-testid={`faq-trigger-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Invest in Dubai Real Estate?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Get personalized guidance from Thrivestate's expert team. Start your tax-free property journey today.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-10 py-6 rounded-full shadow-xl"
              onClick={() => openContactWith("")}
              data-testid="button-final-cta"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Our Experts
            </Button>
            <p className="text-sm text-primary-foreground/60 mt-6">
              Free consultation - No obligation
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
