import { useState } from "react";
import { 
  Building2, Home, TrendingUp, DollarSign, 
  Shield, Clock, CheckCircle2, ChevronDown,
  Mail, User, ArrowRight, Landmark, ChevronLeft,
  Sparkles, Bitcoin, Banknote, Building, CalendarDays,
  Key, BadgeCheck, Wallet, Lock, Zap, Heart, X, ThumbsDown,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

// Quick info items
const QUICK_INFO = [
  { label: "From AED 450K", icon: DollarSign },
  { label: "Crypto & Cash Accepted", icon: Bitcoin },
  { label: "3-5 Year Payment Plans", icon: CalendarDays },
  { label: "15-30% Capital Gains", icon: TrendingUp },
  { label: "Top Developers", icon: Building2 },
];

// Why off-plan advantages
const OFF_PLAN_ADVANTAGES = [
  {
    icon: DollarSign,
    title: "Lower Entry Price",
    description: "15-25% cheaper than completed properties. Lock in today's prices for tomorrow's market.",
  },
  {
    icon: CalendarDays,
    title: "Flexible Payment Plans",
    description: "Pay in installments over 3-5 years during construction. Crypto or cash at each milestone.",
  },
  {
    icon: TrendingUp,
    title: "Capital Appreciation",
    description: "Historical average 15-30% value increase from purchase to handover (2-3 years).",
  },
  {
    icon: Key,
    title: "Post-Handover Plans",
    description: "Select projects allow 3-5 year payments AFTER completion. Move in while still paying.",
  },
  {
    icon: Sparkles,
    title: "Choose Best Units First",
    description: "Pre-launch access means selecting premium views, high floors, corner units before public.",
  },
  {
    icon: BadgeCheck,
    title: "Residency Visa",
    description: "AED 750K+ qualifies for 2-year visa. AED 2M+ qualifies for 10-year Golden Visa.",
  },
];

// Property types for wizard
const PROPERTY_TYPES = [
  { id: "studio", label: "Studio", price: "From AED 450K", icon: Building },
  { id: "1bed", label: "1-Bedroom", price: "From AED 700K", icon: Home },
  { id: "2bed", label: "2-3 Bedroom", price: "From AED 1.1M", icon: Building2 },
  { id: "townhouse", label: "Townhouse", price: "From AED 1.8M", icon: Home },
  { id: "villa", label: "Villa", price: "From AED 3M+", icon: Landmark },
];

// Budget ranges
const BUDGET_RANGES = [
  { id: "450k-700k", label: "AED 450K - 700K", description: "Studios & small apartments" },
  { id: "700k-1.5m", label: "AED 700K - 1.5M", description: "1-2 Bedroom apartments" },
  { id: "1.5m-3m", label: "AED 1.5M - 3M", description: "Large apartments & townhouses" },
  { id: "3m-5m", label: "AED 3M - 5M", description: "Villas & luxury apartments" },
  { id: "5m+", label: "AED 5M+", description: "Luxury villas & penthouses" },
];

// Payment methods
const PAYMENT_METHODS = [
  { id: "cash", label: "Cash / Bank Transfer", icon: Banknote, description: "AED, USD, EUR, GBP" },
  { id: "crypto", label: "Cryptocurrency", icon: Bitcoin, description: "BTC, USDT, ETH" },
  { id: "both", label: "Flexible (Both)", icon: Wallet, description: "Mix crypto & cash" },
];

// Top areas with sample projects
const TOP_AREAS = [
  {
    name: "Dubai Creek Harbour",
    developer: "Emaar",
    type: "Waterfront City",
    price: "Studios from AED 750K",
    handover: "2026-2027",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop",
  },
  {
    name: "Damac Lagoons",
    developer: "Damac",
    type: "Mediterranean Themed",
    price: "Townhouses from AED 1.2M",
    handover: "2026",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  },
  {
    name: "Dubai Hills Estate",
    developer: "Emaar",
    type: "Golf Community",
    price: "Apartments from AED 1.5M",
    handover: "2026-2027",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  },
  {
    name: "Dubai South",
    developer: "Multiple",
    type: "Future Growth Zone",
    price: "Studios from AED 450K",
    handover: "2026",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
  },
  {
    name: "Business Bay",
    developer: "Multiple",
    type: "Business District",
    price: "1-bed from AED 900K",
    handover: "2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  },
  {
    name: "MBR City",
    developer: "Multiple",
    type: "Mega Community",
    price: "Villas from AED 2.5M",
    handover: "2026-2027",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
];

// Developers
const DEVELOPERS = [
  { name: "Emaar", projects: "150+", famous: "Burj Khalifa, Dubai Mall" },
  { name: "Damac", projects: "200+", famous: "Damac Hills, Lagoons" },
  { name: "Meraas", projects: "30+", famous: "City Walk, Bluewaters" },
  { name: "Nakheel", projects: "100+", famous: "Palm Jumeirah" },
  { name: "Sobha", projects: "50+", famous: "Sobha Hartland" },
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: "What is off-plan property in Dubai?",
    answer: "Off-plan property refers to real estate sold before or during construction, allowing buyers to purchase units at pre-completion prices typically 15-25% below market value. In Dubai, all payments are held in DLD-monitored escrow accounts and released to developers only upon verified construction milestones.",
  },
  {
    question: "Can I pay with cryptocurrency?",
    answer: "Yes! Thrivestate facilitates cryptocurrency payments including Bitcoin (BTC), USDT (Tether), and Ethereum (ETH). Payments go through VARA-licensed gateways, are instantly converted to AED, and deposited in regulated escrow accounts with full compliance.",
  },
  {
    question: "How much deposit do I need?",
    answer: "Typical down payments range 10-20% of property value. For a studio at AED 450K, that's AED 45K-90K initial deposit. The remaining balance is spread over 3-5 years during construction milestones.",
  },
  {
    question: "Is it safe to buy off-plan?",
    answer: "Yes. Dubai has comprehensive buyer protections: DLD escrow accounts protect all payments, only RERA-licensed developers can sell off-plan, and DLD-appointed engineers verify construction milestones before releasing funds.",
  },
  {
    question: "Can foreigners buy property in Dubai?",
    answer: "Absolutely. Foreigners can freely purchase freehold property in over 40 designated areas with identical rights to UAE citizens. No local sponsor required. Property purchases of AED 750K+ qualify for investor visas.",
  },
  {
    question: "What is a post-handover payment plan?",
    answer: "Post-handover plans allow you to move into your completed property while continuing to pay installments over 3-5 years after handover. You can start living or earning rental income while spreading the final payments.",
  },
  {
    question: "How long until handover?",
    answer: "Typical off-plan projects take 24-36 months from purchase to handover. Some late-stage projects offer 12-18 month timelines. Thrivestate provides projects at various construction stages.",
  },
  {
    question: "What additional costs are there?",
    answer: "Additional costs include: 4% DLD registration fee (paid on handover), AED 2,000-5,000 trustee fee for SPA signing, and AED 500-2,000 NOC fee. Total approximately 5-7% of property value.",
  },
];

// Interactive Lead Wizard Component
function LeadWizard({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: "",
    budget: "",
    paymentMethod: "",
    name: "",
    email: "",
    phone: "",
    likedProjects: [] as string[],
    dislikedProjects: [] as string[],
    consentPrivacy: false,
    consentMarketing: false,
  });
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!formData.consentPrivacy) return;
    setSubmitted(true);
  };

  const handleProjectSwipe = (liked: boolean) => {
    const project = TOP_AREAS[currentProjectIndex];
    if (liked) {
      setFormData(prev => ({ 
        ...prev, 
        likedProjects: [...prev.likedProjects, project.name] 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        dislikedProjects: [...prev.dislikedProjects, project.name] 
      }));
    }
    
    if (currentProjectIndex < TOP_AREAS.length - 1) {
      setCurrentProjectIndex(currentProjectIndex + 1);
    } else {
      handleNext();
    }
  };

  const resetWizard = () => {
    setStep(1);
    setCurrentProjectIndex(0);
    setFormData({
      propertyType: "",
      budget: "",
      paymentMethod: "",
      name: "",
      email: "",
      phone: "",
      likedProjects: [],
      dislikedProjects: [],
      consentPrivacy: false,
      consentMarketing: false,
    });
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {submitted ? (
          <div className="py-12 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
            <p className="text-muted-foreground mb-2">
              A Thrivestate off-plan specialist will contact you within 24 hours.
            </p>
            {formData.likedProjects.length > 0 && (
              <p className="text-sm text-muted-foreground">
                We noted your interest in: {formData.likedProjects.join(", ")}
              </p>
            )}
            <Button className="mt-6" onClick={resetWizard}>
              Close
            </Button>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Property Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold">What type of property?</h3>
                      <p className="text-muted-foreground text-sm">Select your preferred property type</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {PROPERTY_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = formData.propertyType === type.id;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setFormData({ ...formData, propertyType: type.id })}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              isSelected 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            }`}
                            data-testid={`option-property-${type.id}`}
                          >
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="font-medium">{type.label}</p>
                            <p className="text-xs text-muted-foreground">{type.price}</p>
                          </button>
                        );
                      })}
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      onClick={handleNext}
                      disabled={!formData.propertyType}
                      data-testid="button-wizard-next"
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Budget */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold">What's your budget?</h3>
                      <p className="text-muted-foreground text-sm">Select your investment range</p>
                    </div>
                    <div className="space-y-3">
                      {BUDGET_RANGES.map((range) => {
                        const isSelected = formData.budget === range.id;
                        return (
                          <button
                            key={range.id}
                            onClick={() => setFormData({ ...formData, budget: range.id })}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              isSelected 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            }`}
                            data-testid={`option-budget-${range.id}`}
                          >
                            <p className="font-medium">{range.label}</p>
                            <p className="text-xs text-muted-foreground">{range.description}</p>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" onClick={handleBack}>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={handleNext}
                        disabled={!formData.budget}
                      >
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment Method */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold">How do you prefer to pay?</h3>
                      <p className="text-muted-foreground text-sm">We accept crypto and cash</p>
                    </div>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        const isSelected = formData.paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-4 ${
                              isSelected 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            }`}
                            data-testid={`option-payment-${method.id}`}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isSelected ? "bg-primary/10" : "bg-muted"
                            }`}>
                              <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                              <p className="font-medium">{method.label}</p>
                              <p className="text-xs text-muted-foreground">{method.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" onClick={handleBack}>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={handleNext}
                        disabled={!formData.paymentMethod}
                      >
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Swipe Projects */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold">Which projects interest you?</h3>
                      <p className="text-muted-foreground text-sm">
                        {currentProjectIndex + 1} of {TOP_AREAS.length} - Like or skip
                      </p>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentProjectIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative"
                      >
                        <Card className="overflow-hidden">
                          <div className="relative h-48">
                            <img 
                              src={TOP_AREAS[currentProjectIndex].image}
                              alt={TOP_AREAS[currentProjectIndex].name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <h4 className="font-bold text-lg">{TOP_AREAS[currentProjectIndex].name}</h4>
                              <p className="text-sm text-white/80">{TOP_AREAS[currentProjectIndex].developer}</p>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{TOP_AREAS[currentProjectIndex].type}</span>
                              <span className="font-medium">{TOP_AREAS[currentProjectIndex].price}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Handover: {TOP_AREAS[currentProjectIndex].handover}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center gap-6 pt-4">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="rounded-full w-16 h-16"
                        onClick={() => handleProjectSwipe(false)}
                        data-testid="button-swipe-skip"
                      >
                        <ThumbsDown className="w-6 h-6" />
                      </Button>
                      <Button 
                        size="lg" 
                        className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700"
                        onClick={() => handleProjectSwipe(true)}
                        data-testid="button-swipe-like"
                      >
                        <Heart className="w-6 h-6" />
                      </Button>
                    </div>

                    <div className="flex justify-center gap-1 mt-2">
                      {TOP_AREAS.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx < currentProjectIndex 
                              ? formData.likedProjects.includes(TOP_AREAS[idx].name) 
                                ? "bg-green-500" 
                                : "bg-muted-foreground/30"
                              : idx === currentProjectIndex 
                                ? "bg-primary" 
                                : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>

                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={handleNext}
                    >
                      Skip all and continue
                    </Button>
                  </motion.div>
                )}

                {/* Step 5: Contact Details */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold">Almost there!</h3>
                      <p className="text-muted-foreground text-sm">Enter your details for personalized recommendations</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            required
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
                            data-testid="input-wizard-name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
                            data-testid="input-wizard-email"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Phone (Optional)</label>
                        <input
                          type="tel"
                          placeholder="+971 50 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border bg-background"
                          data-testid="input-wizard-phone"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            required
                            checked={formData.consentPrivacy}
                            onChange={(e) => setFormData({ ...formData, consentPrivacy: e.target.checked })}
                            className="mt-1 w-4 h-4 rounded border-gray-300"
                            data-testid="checkbox-wizard-privacy"
                          />
                          <span className="text-xs text-muted-foreground">
                            I agree to the processing of my personal data by Thrivestate. *
                          </span>
                        </label>
                        
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.consentMarketing}
                            onChange={(e) => setFormData({ ...formData, consentMarketing: e.target.checked })}
                            className="mt-1 w-4 h-4 rounded border-gray-300"
                            data-testid="checkbox-wizard-marketing"
                          />
                          <span className="text-xs text-muted-foreground">
                            I'd like to receive off-plan opportunities and market updates. (Optional)
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" onClick={handleBack}>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.email || !formData.consentPrivacy}
                        data-testid="button-wizard-submit"
                      >
                        Get My Recommendations
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function PublicOffPlan() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [showFullIntro, setShowFullIntro] = useState(false);

  useDocumentMeta({
    title: "Buy Off-Plan Dubai: Crypto & Cash Payment Plans 2025",
    description: "Dubai off-plan properties from AED 450K. Pay with crypto (BTC, USDT, ETH) or cash. Flexible 3-5 year plans, 15-30% capital gains. Thrivestate experts.",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />
      <LeadWizard open={wizardOpen} onOpenChange={setWizardOpen} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
            alt="Dubai off-plan property development under construction with modern architecture and skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-6 text-sm px-4 py-1.5">
            Powered by Thrivestate Off-Plan Specialists
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            Dubai Off-Plan Properties
          </h1>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-6 font-light max-w-3xl mx-auto">
            Invest Early, Pay Less, Gain More
          </h2>

          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm px-4 py-2">
              <Banknote className="w-4 h-4 mr-2" /> Cash
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" /> Bank Transfer
            </Badge>
            <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30 backdrop-blur-sm px-4 py-2">
              <Bitcoin className="w-4 h-4 mr-2" /> BTC / USDT / ETH
            </Badge>
          </div>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full shadow-2xl"
            onClick={() => setWizardOpen(true)}
            data-testid="button-hero-wizard"
          >
            <Building2 className="w-5 h-5 mr-2" />
            Find My Perfect Property
          </Button>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              From AED 450K
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Pay over 3-5 years
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Crypto accepted
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              15-30% capital gains
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
              Off-plan properties in Dubai offer investors the opportunity to purchase under-construction developments at 15-25% below completed market value, with flexible payment plans spreading costs over 3-5 years tied to construction milestones. Thrivestate specializes in securing pre-launch allocations from top developers including Emaar, Damac, Meraas, Nakheel, and Sobha, with cryptocurrency and cash payment options accepted.
            </p>
            
            {showFullIntro && (
              <div className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed animate-in fade-in duration-300 text-left">
                <p className="mb-4">
                  Dubai's off-plan market has matured significantly since 2020, with stricter developer regulations by Dubai Land Department (DLD) and Real Estate Regulatory Agency (RERA) ensuring buyer protection through escrow accounts and transparent construction timelines. All payments are held in DLD-monitored escrow accounts and released to developers only upon verified construction milestones.
                </p>
                <p className="mb-4">
                  In December 2025, Dubai's off-plan market offers exceptional opportunities driven by Expo City Dubai's ongoing expansion, Dubai Creek Harbour mega-development, and Mohammed bin Rashid City entering final phases. Top developers now offer post-handover payment plans allowing buyers to move into completed units while continuing to pay installments.
                </p>
                <p>
                  Studios start AED 450K (Damac Lagoons, Dubai South), 1-bedroom apartments from AED 700K (JVC, Dubai Sports City), 2-bedroom apartments from AED 1.1M (Business Bay, Dubai Hills Estate), 3-bedroom townhouses from AED 1.8M (Damac Hills 2, Arabian Ranches 3), and luxury villas from AED 3M+ (MBR City, Tilal Al Ghaf).
                </p>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              className="mt-6"
              onClick={() => setShowFullIntro(!showFullIntro)}
              data-testid="button-toggle-intro"
            >
              {showFullIntro ? "Show Less" : "Read More About Off-Plan Investment"}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFullIntro ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Payment Methods</h2>
              <p className="text-muted-foreground text-lg">Choose how you want to invest</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cash Payment */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Banknote className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Cash & Bank Transfer</h3>
                    <p className="text-muted-foreground text-sm">Traditional payment methods</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {["AED, USD, EUR, GBP accepted", "Direct bank transfer to escrow", "Cheque payments (UAE banks)", "Wire transfer (SWIFT/IBAN)", "No conversion fees"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setWizardOpen(true)}
                  data-testid="button-inquire-cash"
                >
                  Inquire About Cash Payment
                </Button>
              </Card>

              {/* Crypto Payment */}
              <Card className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Bitcoin className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Cryptocurrency</h3>
                    <p className="text-muted-foreground text-sm">Fast, global, secure</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {["Bitcoin (BTC) accepted", "USDT (Tether) accepted", "Ethereum (ETH) accepted", "Instant conversion to AED", "VARA-licensed gateway", "Perfect for international investors"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => setWizardOpen(true)}
                  data-testid="button-inquire-crypto"
                >
                  <Bitcoin className="w-4 h-4 mr-2" />
                  Inquire About Crypto Payment
                </Button>
              </Card>
            </div>

            {/* Security notice */}
            <div className="mt-8 p-4 rounded-lg bg-background border flex items-start gap-4">
              <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Security & Compliance</p>
                <p className="text-xs text-muted-foreground">
                  All payments (crypto & cash) go directly to DLD-regulated escrow accounts. Full VARA (Virtual Asset Regulatory Authority) compliance for cryptocurrency transactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Off-Plan */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Buy Off-Plan?</h2>
              <p className="text-muted-foreground text-lg">Advantages over ready property</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {OFF_PLAN_ADVANTAGES.map((advantage) => {
                const Icon = advantage.icon;
                return (
                  <Card key={advantage.title} className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{advantage.title}</h3>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">At a Glance</h2>
              <p className="text-muted-foreground text-lg">Essential off-plan information</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: DollarSign, title: "Entry Price", value: "AED 450K", sub: "Crypto & Cash OK" },
                { icon: CalendarDays, title: "Payment", value: "10-20%", sub: "Down, pay over 3-5 years" },
                { icon: TrendingUp, title: "Returns", value: "15-30%", sub: "Capital gains potential" },
                { icon: Clock, title: "Handover", value: "2026-2028", sub: "Varies by project" },
                { icon: Bitcoin, title: "Crypto", value: "BTC/USDT/ETH", sub: "Accepted at all milestones" },
                { icon: Building2, title: "Developers", value: "Emaar, Damac", sub: "Meraas, Nakheel, Sobha" },
                { icon: Shield, title: "Security", value: "DLD Escrow", sub: "VARA compliant" },
                { icon: Zap, title: "Timeline", value: "24-36 mo", sub: "Pre-launch to handover" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{item.title}</p>
                    <p className="text-xl font-bold text-primary">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Areas */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Off-Plan Areas</h2>
              <p className="text-muted-foreground text-lg">Top developments December 2025</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOP_AREAS.map((area) => (
                <Card key={area.name} className="overflow-hidden group">
                  <div className="relative h-48">
                    <img 
                      src={area.image}
                      alt={area.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-amber-500/90">
                      <Bitcoin className="w-3 h-3 mr-1" /> Crypto OK
                    </Badge>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs text-white/70">{area.developer}</p>
                      <h3 className="font-bold text-lg">{area.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm text-muted-foreground">{area.type}</span>
                      <Badge variant="outline" className="text-xs">Handover {area.handover}</Badge>
                    </div>
                    <p className="font-semibold text-primary mb-3">{area.price}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setWizardOpen(true)}
                    >
                      Get Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Developers */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Dubai Developers</h2>
              <p className="text-muted-foreground text-lg">Trusted partners December 2025</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {DEVELOPERS.map((dev) => (
                <Card key={dev.name} className="p-4 text-center">
                  <h3 className="font-bold text-lg mb-1">{dev.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">{dev.projects}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{dev.famous}</p>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-4">All developers: RERA-licensed, DLD-compliant, proven delivery records</p>
              <Button onClick={() => setWizardOpen(true)} data-testid="button-discuss-developers">
                Discuss Developer Options
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">Everything you need to know</p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left font-medium py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Invest in Dubai Off-Plan?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Get personalized recommendations from Thrivestate off-plan specialists. Pay with crypto or cash.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 rounded-full"
              onClick={() => setWizardOpen(true)}
              data-testid="button-final-cta"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Start Your Off-Plan Journey
            </Button>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-1.5">
                <Bitcoin className="w-4 h-4" /> BTC/USDT/ETH
              </span>
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4" /> Cash/Bank Transfer
              </span>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
