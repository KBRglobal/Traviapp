import { useState } from "react";
import { Link } from "wouter";
import { 
  Building2, TrendingUp, MapPin, CheckCircle2, 
  ChevronRight, Bitcoin, Waves, Sailboat
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
    name: "Marina Vista",
    developer: "Emaar",
    type: "Waterfront Apartments",
    priceFrom: "AED 2,400,000",
    completion: "Q2 2026",
    paymentPlan: "60/40",
    roi: "16-19%",
    highlights: ["Marina views", "Beach access", "Premium location"]
  },
  {
    name: "LIV Marina",
    developer: "LIV Developers",
    type: "Luxury Apartments",
    priceFrom: "AED 1,900,000",
    completion: "Q4 2026",
    paymentPlan: "50/50",
    roi: "17-21%",
    highlights: ["Yacht club", "Rooftop infinity pool", "Smart home"]
  },
  {
    name: "The Address Residences",
    developer: "Emaar",
    type: "Branded Residences",
    priceFrom: "AED 3,200,000",
    completion: "Q1 2027",
    paymentPlan: "40/60",
    roi: "14-17%",
    highlights: ["Hotel services", "Marina promenade", "Fine dining"]
  },
  {
    name: "52|42 Tower",
    developer: "Emaar",
    type: "Super Tall Tower",
    priceFrom: "AED 2,800,000",
    completion: "Q3 2026",
    paymentPlan: "60/40",
    roi: "15-18%",
    highlights: ["Iconic design", "Sea views", "Observation deck"]
  }
];

const areaStats = [
  { label: "Avg. Price/sqft", value: "AED 1,950" },
  { label: "Rental Yield", value: "6.5%" },
  { label: "Capital Growth (5yr)", value: "38%" },
  { label: "Active Projects", value: "25+" },
  { label: "Marina Berths", value: "400+" },
  { label: "Walk Score", value: "95/100" }
];

const faqs = [
  {
    question: "Why invest in Dubai Marina off-plan properties?",
    answer: "Dubai Marina offers iconic waterfront living, world-class marina facilities, walkable lifestyle with JBR beach access, and consistent rental demand from expats. The area maintains strong capital appreciation due to limited new supply and premium positioning."
  },
  {
    question: "What are typical payment plans in Dubai Marina?",
    answer: "Most Marina projects offer 60/40 or 50/50 payment plans. Premium branded residences may require 40/60 with larger down payments. Post-handover options of 1-3 years are available on select projects."
  },
  {
    question: "How does Dubai Marina compare to JBR?",
    answer: "Marina focuses on yacht lifestyle and tower living with marina views, while JBR offers beachfront lifestyle. Marina typically has 10-15% lower prices per sqft but higher rental yields due to more efficient unit layouts."
  }
];

const relatedPages = [
  { title: "JBR Off-Plan", href: "/dubai-off-plan-jbr", description: "Beachfront living" },
  { title: "Palm Jumeirah", href: "/dubai-off-plan-palm-jumeirah", description: "Island lifestyle" },
  { title: "Investment Guide", href: "/dubai-off-plan-investment-guide", description: "ROI strategies" },
];

export default function OffPlanDubaiMarina() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useDocumentMeta({
    title: "Dubai Marina Off-Plan Properties 2026 | Waterfront Living & Investment",
    description: "Explore Dubai Marina off-plan properties: iconic waterfront towers, marina views, 6.5% yields. Complete guide with best projects from AED 1.9M and payment plans.",
    ogType: "article"
  });

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Locations" },
        { label: "Dubai Marina" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-marina" />

      <main className="min-h-screen bg-background">
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Sailboat className="h-3 w-3" />
                  Waterfront Living
                </Badge>
                <Badge variant="outline">6.5% Avg. Yield</Badge>
                <Badge variant="outline">25+ Active Projects</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="heading-marina-title">
                Dubai Marina Off-Plan Properties
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                Iconic waterfront district with world-class marina, vibrant promenade, and 
                stunning tower residences. Dubai's most walkable community offers exceptional 
                lifestyle and investment value from AED 1.9M.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-marina">
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
            <h2 className="text-2xl font-bold mb-8 text-center">Dubai Marina Market Overview</h2>
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
            <h2 className="text-3xl font-bold mb-8">Why Invest in Dubai Marina?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <Waves className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Waterfront</h3>
                <p className="text-muted-foreground">
                  3km marina promenade with restaurants, cafes, and yacht berths. 
                  Direct beach access to JBR and The Beach.
                </p>
              </Card>
              
              <Card className="p-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Proven Investment</h3>
                <p className="text-muted-foreground">
                  38% capital growth over 5 years with consistent rental demand. 
                  High occupancy rates from expat professionals.
                </p>
              </Card>
              
              <Card className="p-6">
                <Building2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Iconic Architecture</h3>
                <p className="text-muted-foreground">
                  Home to supertall towers and award-winning designs. 
                  Cayan Tower, Princess Tower, and new landmarks.
                </p>
              </Card>
              
              <Card className="p-6">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connected Location</h3>
                <p className="text-muted-foreground">
                  Metro and tram connectivity. 15 min to Mall of Emirates, 
                  25 min to Downtown Dubai.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">Top Off-Plan Projects in Dubai Marina</h2>
                <p className="text-muted-foreground mt-2">Premium waterfront developments</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Bitcoin className="h-3 w-3" />
                Crypto Accepted
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="overflow-hidden hover-elevate" data-testid={`project-${index}`}>
                  <div className="h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Sailboat className="h-16 w-16 text-muted-foreground/50" />
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
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.highlights.map((h, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{h}</Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full" variant="outline" data-testid={`btn-project-${index}`}>
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
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
          title="Invest in Dubai Marina Off-Plan"
          subtitle="Access exclusive waterfront projects with crypto payments and flexible plans."
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
