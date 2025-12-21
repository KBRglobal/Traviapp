import { useState } from "react";
import { Link } from "wouter";
import { 
  Building2, TrendingUp, Home, CheckCircle2, 
  ChevronRight, Bitcoin, DollarSign, Target
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
    name: "Binghatti Stars",
    developer: "Binghatti",
    type: "Apartments",
    priceFrom: "AED 550,000",
    completion: "Q3 2026",
    paymentPlan: "70/30",
    roi: "22-26%",
    highlights: ["Affordable entry", "High yield", "Post-handover"]
  },
  {
    name: "Ellington House",
    developer: "Ellington Properties",
    type: "Premium Apartments",
    priceFrom: "AED 780,000",
    completion: "Q4 2026",
    paymentPlan: "60/40",
    roi: "19-23%",
    highlights: ["Quality finishes", "Community park", "Modern design"]
  },
  {
    name: "Samana Golf Avenue",
    developer: "Samana",
    type: "Golf Apartments",
    priceFrom: "AED 650,000",
    completion: "Q2 2026",
    paymentPlan: "1% Monthly",
    roi: "20-24%",
    highlights: ["Golf views", "Private pools", "Easy payment"]
  },
  {
    name: "Tiger Sky Tower",
    developer: "Tiger Properties",
    type: "High-Rise",
    priceFrom: "AED 480,000",
    completion: "Q1 2026",
    paymentPlan: "60/40",
    roi: "23-27%",
    highlights: ["Budget friendly", "Community amenities", "Good ROI"]
  }
];

const areaStats = [
  { label: "Avg. Price/sqft", value: "AED 1,100" },
  { label: "Rental Yield", value: "8.2%" },
  { label: "Capital Growth (5yr)", value: "35%" },
  { label: "Active Projects", value: "80+" },
  { label: "Entry Price", value: "AED 450K" },
  { label: "Population", value: "100,000+" }
];

const faqs = [
  {
    question: "Why is JVC Dubai's highest yield area?",
    answer: "JVC offers the best price-to-rent ratio in Dubai due to affordable purchase prices, strong rental demand from young professionals and families, and excellent community infrastructure. Gross yields of 8-10% are common, significantly above Dubai average of 6%."
  },
  {
    question: "What payment plans are available in JVC?",
    answer: "JVC developers offer the most flexible payment plans in Dubai, including 1% monthly post-handover plans for up to 7 years, 70/30 splits, and post-handover options. Entry with as little as AED 45,000 (10%) is possible."
  },
  {
    question: "Is JVC good for first-time investors?",
    answer: "Yes, JVC is ideal for first-time investors due to low entry prices starting from AED 450,000, high rental yields, strong capital growth potential, and diversified tenant pool. The area offers excellent risk-adjusted returns."
  }
];

const relatedPages = [
  { title: "Al Furjan Off-Plan", href: "/dubai-off-plan-al-furjan", description: "Nearby community" },
  { title: "Investment Guide", href: "/dubai-off-plan-investment-guide", description: "ROI strategies" },
  { title: "Payment Plans", href: "/dubai-off-plan-payment-plans", description: "Financing options" },
];

export default function OffPlanJVC() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useDocumentMeta({
    title: "JVC Off-Plan Properties Dubai 2026 | Highest Yields from AED 450K",
    description: "JVC Dubai off-plan properties: highest rental yields at 8.2%, affordable entry from AED 450K, flexible 1% monthly payment plans. Complete 2026 investment guide.",
    ogType: "article"
  });

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Locations" },
        { label: "Jumeirah Village Circle" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-jvc" />

      <main className="min-h-screen bg-background">
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-green-500/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Highest Yields
                </Badge>
                <Badge variant="outline">8.2% Avg. Yield</Badge>
                <Badge variant="outline">From AED 450K</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="heading-jvc-title">
                JVC Off-Plan Properties
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                Dubai's highest-yielding investment destination with affordable entry prices, 
                flexible payment plans, and strong rental demand. Perfect for first-time investors 
                seeking maximum returns from AED 450,000.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-jvc">
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

        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">JVC Market Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {areaStats.map((stat, index) => (
                <Card key={index} className="p-4 text-center" data-testid={`stat-${index}`}>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Why Invest in JVC?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <DollarSign className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Affordable Entry</h3>
                <p className="text-muted-foreground">
                  Studios from AED 450K, 1-beds from AED 650K. Dubai's lowest entry 
                  point for quality off-plan properties.
                </p>
              </Card>
              
              <Card className="p-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Highest Yields</h3>
                <p className="text-muted-foreground">
                  8-10% gross rental yields, highest in Dubai. Strong occupancy 
                  rates from diverse tenant base.
                </p>
              </Card>
              
              <Card className="p-6">
                <Target className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Flexible Plans</h3>
                <p className="text-muted-foreground">
                  1% monthly post-handover available. Start with 10% down payment. 
                  Most flexible terms in Dubai.
                </p>
              </Card>
              
              <Card className="p-6">
                <Home className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Family Community</h3>
                <p className="text-muted-foreground">
                  Parks, schools, retail, and restaurants. Established community 
                  with excellent amenities.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">Top Off-Plan Projects in JVC</h2>
                <p className="text-muted-foreground mt-2">Best value investments in Dubai</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Bitcoin className="h-3 w-3" />
                Crypto Accepted
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="overflow-hidden hover-elevate" data-testid={`project-${index}`}>
                  <div className="h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">by {project.developer}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{project.roi} ROI</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">From</span>
                        <div className="font-semibold">{project.priceFrom}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Plan</span>
                        <div className="font-semibold">{project.paymentPlan}</div>
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline" size="sm" data-testid={`btn-project-${index}`}>
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4" data-testid={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <OffPlanCTASection 
          onCtaClick={() => setWizardOpen(true)}
          title="Invest in JVC Off-Plan"
          subtitle="Access Dubai's highest-yield properties with flexible payment plans from AED 450K."
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
