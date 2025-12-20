import { useState } from "react";
import { Link } from "wouter";
import { 
  Building2, TrendingUp, MapPin, Sparkles, 
  ChevronRight, Bitcoin, Landmark, Waves
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
    name: "Creek Waters",
    developer: "Emaar",
    type: "Waterfront Apartments",
    priceFrom: "AED 1,200,000",
    completion: "Q3 2026",
    paymentPlan: "60/40",
    roi: "17-21%",
    highlights: ["Creek views", "Lagoon access", "Emaar quality"]
  },
  {
    name: "Address Harbour Point",
    developer: "Emaar",
    type: "Branded Residences",
    priceFrom: "AED 2,100,000",
    completion: "Q4 2026",
    paymentPlan: "50/50",
    roi: "15-18%",
    highlights: ["Hotel services", "Tower views", "Premium location"]
  },
  {
    name: "The Cove",
    developer: "Emaar",
    type: "Beachfront Living",
    priceFrom: "AED 1,800,000",
    completion: "Q2 2026",
    paymentPlan: "60/40",
    roi: "16-20%",
    highlights: ["Private beach", "Lagoon pool", "Low density"]
  },
  {
    name: "Creek Edge",
    developer: "Emaar",
    type: "Mid-Rise Apartments",
    priceFrom: "AED 950,000",
    completion: "Q1 2026",
    paymentPlan: "70/30",
    roi: "18-22%",
    highlights: ["Affordable entry", "Creek proximity", "Community feel"]
  }
];

const areaStats = [
  { label: "Avg. Price/sqft", value: "AED 1,750" },
  { label: "Rental Yield", value: "6.8%" },
  { label: "Capital Growth (5yr)", value: "52%" },
  { label: "Active Projects", value: "18" },
  { label: "Master Developer", value: "Emaar" },
  { label: "Creek Tower", value: "1,300m+" }
];

const faqs = [
  {
    question: "Why is Dubai Creek Harbour a good investment?",
    answer: "Creek Harbour is Emaar's flagship master community offering excellent value vs Downtown Dubai, strong appreciation potential (52% over 5 years), waterfront living, and future growth as the Creek Tower area develops. Entry prices are 20-30% below Downtown."
  },
  {
    question: "When will Creek Tower be completed?",
    answer: "Creek Tower, set to become the world's tallest structure at 1,300m+, is currently on hold. However, the surrounding community continues to develop with residential towers and retail districts delivering on schedule."
  },
  {
    question: "What are Creek Harbour payment plans?",
    answer: "Emaar offers standard 60/40 and 70/30 plans for Creek Harbour projects. The Address brand projects may require 50/50. Post-handover options of 1-2 years are available on select inventory."
  }
];

const relatedPages = [
  { title: "Downtown Dubai", href: "/dubai-off-plan-downtown", description: "Sister community" },
  { title: "Business Bay", href: "/dubai-off-plan-business-bay", description: "Adjacent area" },
  { title: "Emaar Projects", href: "/dubai-off-plan-emaar", description: "Developer page" },
];

export default function OffPlanCreekHarbour() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useDocumentMeta({
    title: "Dubai Creek Harbour Off-Plan 2026 | Waterfront Living from AED 950K",
    description: "Dubai Creek Harbour off-plan properties: Emaar's flagship waterfront community, future Creek Tower, from AED 950K. Complete guide with ROI analysis and payment plans.",
    ogType: "article"
  });

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Locations" },
        { label: "Creek Harbour" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-creek-harbour" />

      <main className="min-h-screen bg-background">
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-cyan-500/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Landmark className="h-3 w-3" />
                  Future Icon
                </Badge>
                <Badge variant="outline">6.8% Avg. Yield</Badge>
                <Badge variant="outline">Emaar Master Plan</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="heading-creek-title">
                Creek Harbour Off-Plan Properties
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                Emaar's visionary waterfront community featuring the future world's tallest tower. 
                Premium living at 20-30% below Downtown prices with exceptional appreciation 
                potential from AED 950,000.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-creek">
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
            <h2 className="text-2xl font-bold mb-8 text-center">Creek Harbour Market Overview</h2>
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
            <h2 className="text-3xl font-bold mb-8">Why Invest in Creek Harbour?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <Sparkles className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Future Growth</h3>
                <p className="text-muted-foreground">
                  Creek Tower will transform the area into a global landmark. 
                  Early investors benefit from appreciation potential.
                </p>
              </Card>
              
              <Card className="p-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Strong Returns</h3>
                <p className="text-muted-foreground">
                  52% capital growth over 5 years with 6.8% rental yields. 
                  Outperforming many established areas.
                </p>
              </Card>
              
              <Card className="p-6">
                <Waves className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Waterfront Living</h3>
                <p className="text-muted-foreground">
                  Lagoons, beaches, promenades, and marina access. 
                  Complete waterfront lifestyle in central Dubai.
                </p>
              </Card>
              
              <Card className="p-6">
                <Building2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Emaar Quality</h3>
                <p className="text-muted-foreground">
                  Master-planned by Dubai's most trusted developer. 
                  95% on-time delivery with premium finishes.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">Top Off-Plan Projects in Creek Harbour</h2>
                <p className="text-muted-foreground mt-2">Emaar's waterfront developments</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Bitcoin className="h-3 w-3" />
                Crypto Accepted
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="overflow-hidden hover-elevate" data-testid={`project-${index}`}>
                  <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <Landmark className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
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
                        <span className="text-muted-foreground">Plan</span>
                        <div className="font-semibold">{project.paymentPlan}</div>
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
          title="Invest in Creek Harbour Off-Plan"
          subtitle="Access Emaar's flagship waterfront community with exceptional growth potential."
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
