import { useState } from "react";
import { Link } from "wouter";
import { 
  Building2, TrendingUp, Palmtree, CheckCircle2, 
  ChevronRight, Bitcoin, Crown, Waves
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
    name: "Como Residences",
    developer: "Nakheel",
    type: "Ultra-Luxury Residences",
    priceFrom: "AED 21,000,000",
    completion: "Q4 2027",
    paymentPlan: "40/60",
    roi: "10-14%",
    highlights: ["Beachfront", "Private pools", "Italian design"]
  },
  {
    name: "Palm Jebel Ali",
    developer: "Nakheel",
    type: "Beachfront Villas",
    priceFrom: "AED 15,000,000",
    completion: "Q2 2028",
    paymentPlan: "50/50",
    roi: "12-16%",
    highlights: ["New Palm island", "Beach plots", "Limited supply"]
  },
  {
    name: "Six Senses Residences",
    developer: "Select Group",
    type: "Branded Wellness",
    priceFrom: "AED 8,500,000",
    completion: "Q1 2026",
    paymentPlan: "60/40",
    roi: "11-15%",
    highlights: ["Wellness brand", "Spa facilities", "Marina views"]
  },
  {
    name: "Atlantis The Royal Residences",
    developer: "Kerzner",
    type: "Hotel Residences",
    priceFrom: "AED 12,000,000",
    completion: "Ready",
    paymentPlan: "Cash",
    roi: "9-12%",
    highlights: ["Atlantis services", "Iconic location", "Rental program"]
  }
];

const areaStats = [
  { label: "Avg. Price/sqft", value: "AED 3,800" },
  { label: "Rental Yield", value: "4.5%" },
  { label: "Capital Growth (5yr)", value: "65%" },
  { label: "Active Projects", value: "12" },
  { label: "Entry Price", value: "AED 5M+" },
  { label: "Frond Villas", value: "Sold Out" }
];

const faqs = [
  {
    question: "Is Palm Jumeirah good for off-plan investment?",
    answer: "Palm Jumeirah offers prestige, scarcity value, and strong capital appreciation (65% over 5 years) but lower rental yields (4-5%) due to high purchase prices. Best for capital growth and lifestyle buyers rather than yield-focused investors."
  },
  {
    question: "What are the new off-plan projects on Palm Jumeirah?",
    answer: "Current off-plan opportunities include Como Residences by Nakheel, Six Senses Residences, and the upcoming Palm Jebel Ali mega-project. Supply is extremely limited due to land scarcity."
  },
  {
    question: "How do Palm Jumeirah prices compare to other areas?",
    answer: "Palm commands premium pricing at AED 3,800+ per sqft vs Marina (AED 1,950) or Business Bay (AED 2,100). However, villas and beachfront units have shown 100%+ appreciation over 10 years."
  }
];

const relatedPages = [
  { title: "Dubai Marina", href: "/dubai-off-plan-marina", description: "Waterfront alternative" },
  { title: "Luxury Villas", href: "/dubai-off-plan-villas", description: "Villa investments" },
  { title: "Best 2025 Projects", href: "/best-off-plan-projects-dubai-2025", description: "Top picks" },
];

export default function OffPlanPalmJumeirah() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useDocumentMeta({
    title: "Palm Jumeirah Off-Plan Properties 2025 | Luxury Beachfront from AED 5M",
    description: "Palm Jumeirah off-plan properties: iconic island living, beachfront villas, 65% capital growth. Exclusive projects from Nakheel and Six Senses from AED 5M.",
    ogType: "article"
  });

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Locations" },
        { label: "Palm Jumeirah" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-palm-jumeirah" />

      <main className="min-h-screen bg-background">
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-amber-500/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Crown className="h-3 w-3" />
                  Ultra-Luxury
                </Badge>
                <Badge variant="outline">65% Capital Growth</Badge>
                <Badge variant="outline">Iconic Location</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="heading-palm-title">
                Palm Jumeirah Off-Plan Properties
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                The world's most iconic man-made island offers ultra-luxury beachfront living 
                with exceptional capital appreciation. Limited new supply ensures long-term 
                value for discerning investors from AED 5M.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-palm">
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
            <h2 className="text-2xl font-bold mb-8 text-center">Palm Jumeirah Market Overview</h2>
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
            <h2 className="text-3xl font-bold mb-8">Why Invest in Palm Jumeirah?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <Palmtree className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Iconic Location</h3>
                <p className="text-muted-foreground">
                  World-famous palm-shaped island visible from space. 
                  Dubai's most prestigious address and ultimate status symbol.
                </p>
              </Card>
              
              <Card className="p-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Capital Growth</h3>
                <p className="text-muted-foreground">
                  65% appreciation over 5 years, with prime villas 
                  doubling in value. Scarcity drives long-term gains.
                </p>
              </Card>
              
              <Card className="p-6">
                <Waves className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Beachfront Living</h3>
                <p className="text-muted-foreground">
                  Private beaches, crystal-clear waters, and resort lifestyle. 
                  Every residence enjoys waterfront access.
                </p>
              </Card>
              
              <Card className="p-6">
                <Crown className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ultra-Luxury</h3>
                <p className="text-muted-foreground">
                  Branded residences from Armani, Six Senses, Atlantis. 
                  World-class amenities and exclusive lifestyle.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">Off-Plan Projects on Palm Jumeirah</h2>
                <p className="text-muted-foreground mt-2">Exclusive ultra-luxury developments</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Bitcoin className="h-3 w-3" />
                Crypto Accepted
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="overflow-hidden hover-elevate" data-testid={`project-${index}`}>
                  <div className="h-56 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Palmtree className="h-20 w-20 text-muted-foreground/50" />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-xl">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">by {project.developer}</p>
                      </div>
                      <Badge variant="outline">{project.roi} ROI</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">From</span>
                        <div className="font-semibold">{project.priceFrom}</div>
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
          title="Invest in Palm Jumeirah Off-Plan"
          subtitle="Access exclusive beachfront properties on the world's most iconic island."
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
