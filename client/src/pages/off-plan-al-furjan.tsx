import { useState } from "react";
import { Link } from "wouter";
import { 
  Building2, TrendingUp, Home, Users, 
  ChevronRight, Bitcoin, School, Trees
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
    name: "Expo Central",
    developer: "DAMAC",
    type: "Apartments",
    priceFrom: "AED 680,000",
    completion: "Q4 2025",
    paymentPlan: "60/40",
    roi: "19-23%",
    highlights: ["Near Expo 2020", "Metro access", "Modern design"]
  },
  {
    name: "Azizi Riviera",
    developer: "Azizi",
    type: "Waterfront Apartments",
    priceFrom: "AED 550,000",
    completion: "Ready",
    paymentPlan: "Cash",
    roi: "21-25%",
    highlights: ["Canal views", "Beach pool", "Shopping mall"]
  },
  {
    name: "Nakheel Furjan East",
    developer: "Nakheel",
    type: "Townhouses",
    priceFrom: "AED 1,400,000",
    completion: "Q2 2026",
    paymentPlan: "50/50",
    roi: "16-20%",
    highlights: ["Family homes", "Private garden", "Community parks"]
  },
  {
    name: "Ellington Views",
    developer: "Ellington",
    type: "Premium Apartments",
    priceFrom: "AED 850,000",
    completion: "Q3 2025",
    paymentPlan: "60/40",
    roi: "18-22%",
    highlights: ["Quality finishes", "Green spaces", "Smart home"]
  }
];

const areaStats = [
  { label: "Avg. Price/sqft", value: "AED 1,050" },
  { label: "Rental Yield", value: "7.5%" },
  { label: "Capital Growth (5yr)", value: "40%" },
  { label: "Active Projects", value: "30+" },
  { label: "Entry Price", value: "AED 550K" },
  { label: "Community Rating", value: "4.5/5" }
];

const faqs = [
  {
    question: "Why invest in Al Furjan off-plan properties?",
    answer: "Al Furjan offers excellent value with affordable entry prices, high rental yields (7-8%), and proximity to Expo City, Al Maktoum Airport, and metro stations. The mature community has schools, parks, and retail, attracting long-term family tenants."
  },
  {
    question: "How does Al Furjan compare to JVC?",
    answer: "Both offer high yields and affordable entry. Al Furjan has more established infrastructure and family orientation with villas and townhouses. JVC has more apartments and higher project density. Al Furjan averages slightly lower yields but stronger capital growth."
  },
  {
    question: "What are typical Al Furjan payment plans?",
    answer: "Most Al Furjan projects offer 60/40 or 50/50 payment plans. Azizi provides some of the most flexible options with 1% monthly plans. Down payments typically range from 10-20% depending on developer."
  }
];

const relatedPages = [
  { title: "JVC Off-Plan", href: "/dubai-off-plan-jvc", description: "Nearby community" },
  { title: "Dubai Villas", href: "/dubai-off-plan-villas", description: "Villa options" },
  { title: "Investment Guide", href: "/dubai-off-plan-investment-guide", description: "ROI strategies" },
];

export default function OffPlanAlFurjan() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useDocumentMeta({
    title: "Al Furjan Off-Plan Properties Dubai 2025 | Family Living from AED 550K",
    description: "Al Furjan Dubai off-plan properties: family-friendly community, 7.5% yields, near metro and Expo City. Complete guide with townhouses and apartments from AED 550K.",
    ogType: "article"
  });

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Locations" },
        { label: "Al Furjan" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-al-furjan" />

      <main className="min-h-screen bg-background">
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-green-500/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  Family Community
                </Badge>
                <Badge variant="outline">7.5% Avg. Yield</Badge>
                <Badge variant="outline">Metro Connected</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="heading-furjan-title">
                Al Furjan Off-Plan Properties
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                Established family community with excellent infrastructure, metro connectivity, 
                and proximity to Expo City. Affordable apartments and townhouses with strong 
                rental demand from AED 550,000.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-furjan">
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
            <h2 className="text-2xl font-bold mb-8 text-center">Al Furjan Market Overview</h2>
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
            <h2 className="text-3xl font-bold mb-8">Why Invest in Al Furjan?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <Home className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Family Focus</h3>
                <p className="text-muted-foreground">
                  Villas, townhouses, and apartments in a safe community. 
                  Parks, playgrounds, and family amenities throughout.
                </p>
              </Card>
              
              <Card className="p-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Strong Yields</h3>
                <p className="text-muted-foreground">
                  7.5% average gross yields with consistent demand. 
                  Long-term family tenants ensure stable income.
                </p>
              </Card>
              
              <Card className="p-6">
                <School className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Full Infrastructure</h3>
                <p className="text-muted-foreground">
                  Schools, nurseries, healthcare, and retail. 
                  Ibn Battuta Mall and Metro within reach.
                </p>
              </Card>
              
              <Card className="p-6">
                <Trees className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Green Living</h3>
                <p className="text-muted-foreground">
                  Landscaped gardens, walking trails, and community parks. 
                  Suburban feel with urban convenience.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">Top Off-Plan Projects in Al Furjan</h2>
                <p className="text-muted-foreground mt-2">Family-friendly developments</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Bitcoin className="h-3 w-3" />
                Crypto Accepted
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="overflow-hidden hover-elevate" data-testid={`project-${index}`}>
                  <div className="h-48 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Home className="h-16 w-16 text-muted-foreground/50" />
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
          title="Invest in Al Furjan Off-Plan"
          subtitle="Access family-friendly properties with strong yields and community living."
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
