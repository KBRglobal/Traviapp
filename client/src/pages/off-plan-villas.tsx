import { useState } from "react";
import { Link } from "wouter";
import { 
  Building2, TrendingUp, Home, Trees, 
  ChevronRight, Bitcoin, MapPin, Users
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
    name: "The Valley",
    developer: "Emaar",
    type: "Family Villas",
    priceFrom: "AED 1,500,000",
    completion: "Q2 2026",
    paymentPlan: "80/20",
    roi: "14-18%",
    location: "Dubai-Al Ain Road",
    highlights: ["Town Square", "Sports facilities", "International schools"]
  },
  {
    name: "Tilal Al Ghaf",
    developer: "Majid Al Futtaim",
    type: "Luxury Villas",
    priceFrom: "AED 3,200,000",
    completion: "Q4 2026",
    paymentPlan: "60/40",
    roi: "12-16%",
    location: "Dubailand",
    highlights: ["Lagoon living", "Crystal lagoon", "Wellness focus"]
  },
  {
    name: "Damac Hills 2",
    developer: "DAMAC",
    type: "Affordable Villas",
    priceFrom: "AED 900,000",
    completion: "Q3 2026",
    paymentPlan: "70/30",
    roi: "16-20%",
    location: "Dubailand",
    highlights: ["Golf course", "Clubhouse", "Budget friendly"]
  },
  {
    name: "Arabian Ranches 3",
    developer: "Emaar",
    type: "Premium Villas",
    priceFrom: "AED 2,400,000",
    completion: "Q1 2026",
    paymentPlan: "60/40",
    roi: "13-17%",
    location: "Arabian Ranches",
    highlights: ["Established community", "Schools nearby", "Golf access"]
  },
  {
    name: "Palm Jebel Ali Villas",
    developer: "Nakheel",
    type: "Beachfront Villas",
    priceFrom: "AED 15,000,000",
    completion: "Q4 2027",
    paymentPlan: "50/50",
    roi: "10-14%",
    location: "Palm Jebel Ali",
    highlights: ["Private beach", "Limited plots", "Iconic location"]
  },
  {
    name: "Expo Valley",
    developer: "Expo City",
    type: "Modern Townhouses",
    priceFrom: "AED 1,800,000",
    completion: "Q2 2026",
    paymentPlan: "60/40",
    roi: "15-19%",
    location: "Expo City",
    highlights: ["Smart city", "Sustainability", "Metro access"]
  }
];

const areaStats = [
  { label: "Avg. Villa Price", value: "AED 3.5M" },
  { label: "Rental Yield", value: "5.2%" },
  { label: "Capital Growth (5yr)", value: "55%" },
  { label: "Active Projects", value: "45+" },
  { label: "Entry (3-bed)", value: "AED 900K" },
  { label: "Plot Sizes", value: "2,500-15,000 sqft" }
];

const faqs = [
  {
    question: "Are Dubai villas a good investment in 2026?",
    answer: "Yes, Dubai villas have shown 55% capital appreciation over 5 years, outperforming apartments. Post-pandemic demand for space, gardens, and privacy has driven sustained interest. Villa rental yields (5-6%) are slightly lower than apartments but capital growth is significantly higher."
  },
  {
    question: "Where are the best off-plan villa communities?",
    answer: "Top communities include The Valley (Emaar, affordable), Tilal Al Ghaf (lagoon lifestyle), Arabian Ranches 3 (established), Damac Hills 2 (budget), and Palm Jebel Ali (ultra-luxury). Location choice depends on budget, lifestyle preferences, and investment goals."
  },
  {
    question: "What payment plans are available for villas?",
    answer: "Villa payment plans are often more flexible than apartments due to higher prices. Common structures include 80/20 (The Valley), 60/40 (most projects), and 50/50 (Palm Jebel Ali). Post-handover plans of 2-5 years are available on select developments."
  },
  {
    question: "What villa sizes are available off-plan?",
    answer: "Off-plan villas range from 3-bedroom townhouses (2,000 sqft from AED 900K) to 7-bedroom mansions (15,000+ sqft from AED 20M+). Most popular are 4-5 bedroom villas (3,500-5,000 sqft) in the AED 2-4M range."
  }
];

const relatedPages = [
  { title: "Palm Jumeirah", href: "/dubai-off-plan-palm-jumeirah", description: "Luxury beachfront" },
  { title: "Al Furjan", href: "/dubai-off-plan-al-furjan", description: "Family townhouses" },
  { title: "Best 2026 Projects", href: "/best-off-plan-projects-dubai-2026", description: "Top investments" },
];

export default function OffPlanVillas() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useDocumentMeta({
    title: "Dubai Off-Plan Villas 2026 | Best Villa Communities from AED 900K",
    description: "Complete guide to Dubai off-plan villas: best communities, payment plans, and ROI analysis. Family villas, townhouses, and luxury estates from AED 900K with 55% growth.",
    ogType: "article"
  });

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Property Types" },
        { label: "Villas" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-villas" />

      <main className="min-h-screen bg-background">
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-amber-500/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Home className="h-3 w-3" />
                  Villa Living
                </Badge>
                <Badge variant="outline">55% Capital Growth</Badge>
                <Badge variant="outline">From AED 900K</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="heading-villas-title">
                Dubai Off-Plan Villas
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                Private gardens, spacious living, and community amenities. Dubai's villa market 
                offers exceptional capital growth with family-focused communities from the world's 
                top developers, starting at AED 900,000.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-villas">
                  Explore Communities
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
            <h2 className="text-2xl font-bold mb-8 text-center">Dubai Villa Market Overview</h2>
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
            <h2 className="text-3xl font-bold mb-8">Why Invest in Dubai Villas?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Superior Growth</h3>
                <p className="text-muted-foreground">
                  55% capital appreciation over 5 years, outperforming apartments. 
                  Scarcity of land drives long-term value.
                </p>
              </Card>
              
              <Card className="p-6">
                <Home className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Space & Privacy</h3>
                <p className="text-muted-foreground">
                  Private gardens, multiple floors, and standalone living. 
                  Ideal for families seeking space and independence.
                </p>
              </Card>
              
              <Card className="p-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Family Demand</h3>
                <p className="text-muted-foreground">
                  Strong rental demand from families seeking long-term homes. 
                  Lower tenant turnover and stable income.
                </p>
              </Card>
              
              <Card className="p-6">
                <Trees className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Community Living</h3>
                <p className="text-muted-foreground">
                  Master-planned communities with parks, schools, retail, 
                  and sports facilities.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">Top Off-Plan Villa Communities</h2>
                <p className="text-muted-foreground mt-2">Best investment opportunities in Dubai</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Bitcoin className="h-3 w-3" />
                Crypto Accepted
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="overflow-hidden hover-elevate" data-testid={`project-${index}`}>
                  <div className="h-48 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <Home className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">by {project.developer}</p>
                      </div>
                      <Badge variant="outline">{project.roi} ROI</Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">From</span>
                        <div className="font-semibold">{project.priceFrom}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Plan</span>
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
          title="Invest in Dubai Villas"
          subtitle="Access the best villa communities with flexible payment plans and crypto acceptance."
          ctaText="Get Started"
        />

        <RelatedLinks 
          title="Explore More" 
          links={relatedPages.map(p => ({ title: p.title, href: p.href }))} 
        />

        <TrustSignals />
      </main>
    </>
  );
}
