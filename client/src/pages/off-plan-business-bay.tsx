import { useState } from "react";
import { Link } from "wouter";
import { 
  Building2, TrendingUp, MapPin, CheckCircle2, 
  ChevronRight, Bitcoin, Award, Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PublicNav } from "@/components/public-nav";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { 
  OffPlanStatsBar, 
  OffPlanBreadcrumb, 
  OffPlanSubNav,
  OffPlanCTASection,
  RelatedLinks,
  TrustSignals
} from "@/components/off-plan-shared";

const projects = [
  {
    name: "The Residences at Dorchester Collection",
    developer: "Omniyat",
    type: "Ultra-Luxury Apartments",
    priceFrom: "AED 8,500,000",
    completion: "Q4 2026",
    paymentPlan: "40/60",
    roi: "15-18%",
    highlights: ["Branded residences", "Burj Khalifa views", "Private amenities"]
  },
  {
    name: "Paramount Tower Hotel & Residences",
    developer: "DAMAC",
    type: "Branded Residences",
    priceFrom: "AED 1,200,000",
    completion: "Q2 2026",
    paymentPlan: "60/40",
    roi: "18-22%",
    highlights: ["Hotel management", "Pool deck", "Cinema-themed interiors"]
  },
  {
    name: "MARQUISE Square Tower",
    developer: "Select Group",
    type: "Luxury Apartments",
    priceFrom: "AED 1,800,000",
    completion: "Q3 2025",
    paymentPlan: "50/50",
    roi: "16-20%",
    highlights: ["Canal views", "Smart home tech", "Infinity pool"]
  },
  {
    name: "The Opus by Zaha Hadid",
    developer: "Omniyat",
    type: "Designer Residences",
    priceFrom: "AED 3,500,000",
    completion: "Ready",
    paymentPlan: "Cash",
    roi: "12-15%",
    highlights: ["Iconic architecture", "ME Hotel services", "Limited units"]
  },
  {
    name: "One at Palm",
    developer: "Omniyat",
    type: "Super Luxury",
    priceFrom: "AED 5,000,000",
    completion: "Q1 2027",
    paymentPlan: "30/70",
    roi: "14-17%",
    highlights: ["Dorchester service", "Private pools", "Marina access"]
  }
];

const areaStats = [
  { label: "Avg. Price/sqft", value: "AED 2,100" },
  { label: "Rental Yield", value: "6.8%" },
  { label: "Capital Growth (5yr)", value: "42%" },
  { label: "Active Projects", value: "35+" },
  { label: "Units in Pipeline", value: "12,000+" },
  { label: "Completion Rate", value: "92%" }
];

const faqs = [
  {
    question: "Why is Business Bay popular for off-plan investment?",
    answer: "Business Bay offers prime central location next to Downtown Dubai, strong rental yields (6.5-7.5%), direct Dubai Canal access, and proximity to DIFC financial district. Entry prices start 20-30% below Downtown while offering similar lifestyle amenities and appreciation potential."
  },
  {
    question: "What are the best off-plan projects in Business Bay 2025?",
    answer: "Top projects include Dorchester Collection Residences (ultra-luxury), Paramount Tower (branded residences), MARQUISE Square (canal views), and Peninsula by Select Group. Each offers unique value propositions from investment ROI to lifestyle amenities."
  },
  {
    question: "How do Business Bay prices compare to Downtown Dubai?",
    answer: "Business Bay averages AED 1,800-2,200 per sqft compared to Downtown's AED 2,800-4,500. This 25-40% discount offers significant value, especially for canal-facing and Burj Khalifa view units that command premium resale prices."
  },
  {
    question: "What payment plans are available in Business Bay?",
    answer: "Most Business Bay developers offer 60/40, 50/50, or 70/30 payment plans. Some post-handover options extend to 5 years. All RERA-regulated projects accept crypto payments via VARA-licensed providers."
  },
  {
    question: "Is Business Bay good for rental income?",
    answer: "Yes, Business Bay ranks among Dubai's top 5 rental yield areas at 6.5-7.5% gross. Strong corporate tenant demand from nearby DIFC and Downtown, plus canal lifestyle appeal, ensures consistent occupancy rates above 90%."
  },
  {
    question: "When will Business Bay off-plan projects be completed?",
    answer: "Current pipeline shows deliveries through 2028, with major completions in Q2-Q4 2025 and 2026. Developer track records average 92% on-time delivery for Business Bay, among Dubai's highest completion rates."
  }
];

const relatedPages = [
  { title: "Downtown Dubai Off-Plan", href: "/dubai-off-plan-downtown", description: "Adjacent luxury district" },
  { title: "DIFC Off-Plan", href: "/dubai-off-plan-difc", description: "Financial district" },
  { title: "Best 2025 Projects", href: "/best-off-plan-projects-dubai-2025", description: "Top investments" },
  { title: "Payment Plans Guide", href: "/dubai-off-plan-payment-plans", description: "Financing options" },
];

export default function OffPlanBusinessBay() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useDocumentMeta({
    title: "Business Bay Off-Plan Properties Dubai 2025 | Best Projects & ROI Analysis",
    description: "Discover the best off-plan properties in Business Bay Dubai: central location, 6.8% yields, canal views, from AED 1.2M. Complete 2025 guide with payment plans and ROI analysis.",
    ogType: "article"
  });

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Locations" },
        { label: "Business Bay" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-business-bay" />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  Central Dubai
                </Badge>
                <Badge variant="outline">6.8% Avg. Yield</Badge>
                <Badge variant="outline">35+ Active Projects</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="heading-business-bay-title">
                Business Bay Off-Plan Properties
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                Dubai's most dynamic mixed-use district offers exceptional off-plan opportunities 
                with canal-front living, Burj Khalifa views, and strong rental yields. Prices start 
                from AED 1.2M with flexible payment plans and crypto acceptance.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-projects">
                  Explore Projects
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/dubai-off-plan-investment-guide">
                  <Button size="lg" variant="outline" data-testid="button-investment-guide">
                    Investment Guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Area Statistics */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Business Bay Market Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {areaStats.map((stat, index) => (
                <Card key={index} className="p-4 text-center" data-testid={`stat-card-${index}`}>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Business Bay Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Why Invest in Business Bay Off-Plan?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Prime Central Location</h3>
                <p className="text-muted-foreground">
                  Adjacent to Downtown Dubai and DIFC, with direct metro access and Dubai Canal waterfront. 
                  5-minute walk to Dubai Mall and Burj Khalifa.
                </p>
              </Card>
              
              <Card className="p-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Strong Capital Growth</h3>
                <p className="text-muted-foreground">
                  42% average appreciation over 5 years with continued infrastructure development. 
                  Premium waterfront units show 50%+ capital gains.
                </p>
              </Card>
              
              <Card className="p-6">
                <Building2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Developments</h3>
                <p className="text-muted-foreground">
                  Branded residences from Dorchester, Paramount, and W Hotels. Mixed-use towers 
                  with retail, dining, and lifestyle amenities.
                </p>
              </Card>
              
              <Card className="p-6">
                <Target className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Value vs Downtown</h3>
                <p className="text-muted-foreground">
                  25-40% lower entry prices than Downtown Dubai for comparable quality. 
                  Higher rental yields due to competitive pricing.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">Top Off-Plan Projects in Business Bay</h2>
                <p className="text-muted-foreground mt-2">Curated selection of best investment opportunities</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Bitcoin className="h-3 w-3" />
                Crypto Accepted
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project, index) => (
                <Card key={index} className="overflow-hidden hover-elevate" data-testid={`project-card-${index}`}>
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">by {project.developer}</p>
                      </div>
                      <Badge variant="outline">{project.roi} ROI</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">From</span>
                        <div className="font-semibold">{project.priceFrom}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment</span>
                        <div className="font-semibold">{project.paymentPlan}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type</span>
                        <div className="font-semibold">{project.type}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Handover</span>
                        <div className="font-semibold">{project.completion}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.highlights.map((h, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{h}</Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full" variant="outline" data-testid={`button-view-project-${index}`}>
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Analysis */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Business Bay Investment Analysis</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Investment Strengths
                </h3>
                <ul className="space-y-3">
                  {[
                    "Central location with excellent connectivity to all Dubai areas",
                    "Dubai Canal waterfront lifestyle with promenades and dining",
                    "Strong corporate tenant demand from nearby DIFC businesses",
                    "Mixed-use development ensures 24/7 community activity",
                    "Metro connectivity with Business Bay and Marasi stations",
                    "Proven developer track record with 92% on-time delivery"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Price Comparison (per sqft)</h3>
                <div className="space-y-4">
                  {[
                    { area: "Business Bay", price: "AED 2,100", highlight: true },
                    { area: "Downtown Dubai", price: "AED 3,200", highlight: false },
                    { area: "Dubai Marina", price: "AED 1,950", highlight: false },
                    { area: "JVC", price: "AED 1,100", highlight: false },
                    { area: "Palm Jumeirah", price: "AED 3,800", highlight: false }
                  ].map((item, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-md ${item.highlight ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}`}>
                      <span className={item.highlight ? 'font-semibold' : ''}>{item.area}</span>
                      <span className="font-mono font-semibold">{item.price}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  * Prices are indicative averages for off-plan properties as of Q4 2024
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4" data-testid={`faq-item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <OffPlanCTASection 
          onCtaClick={() => setWizardOpen(true)}
          title="Invest in Business Bay Off-Plan"
          subtitle="Get expert guidance on the best Business Bay off-plan opportunities with crypto payment options and flexible plans."
          ctaText="Get Started"
        />

        <RelatedLinks 
          title="Explore More Locations" 
          links={relatedPages.map(p => ({ title: p.title, href: p.href }))} 
        />

        <TrustSignals />
      </main>
    </>
  );
}
