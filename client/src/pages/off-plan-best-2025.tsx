import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Building2, CheckCircle2, TrendingUp, 
  Star, Bitcoin, ChevronRight, Award,
  Wallet, Clock, Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/public-nav";
import { 
  OffPlanStatsBar, 
  OffPlanBreadcrumb, 
  OffPlanSubNav,
  TrustSignals,
  RelatedLinks,
  OffPlanCTASection 
} from "@/components/off-plan-shared";

const TOP_PROJECTS_2025 = [
  {
    name: "Dubai Creek Residences",
    developer: "Emaar",
    location: "Dubai Creek Harbour",
    priceFrom: "AED 1,400,000",
    type: "1-4 BR Apartments",
    handover: "Q4 2026",
    paymentPlan: "60/40",
    expectedRoi: "25-30%",
    highlights: ["Creek Tower views", "Waterfront location", "Emaar quality"],
    rating: 9.5
  },
  {
    name: "Sobha One",
    developer: "Sobha",
    location: "Sobha Hartland 2",
    priceFrom: "AED 1,100,000",
    type: "1-3 BR Apartments",
    handover: "Q2 2027",
    paymentPlan: "70/30",
    expectedRoi: "22-28%",
    highlights: ["94% on-time track record", "Premium finishes", "Lagoon community"],
    rating: 9.3
  },
  {
    name: "The Acres by Meraas",
    developer: "Meraas",
    location: "Dubailand",
    priceFrom: "AED 3,500,000",
    type: "4-6 BR Villas",
    handover: "Q3 2027",
    paymentPlan: "60/40 Post-Handover",
    expectedRoi: "20-25%",
    highlights: ["First villa community by Meraas", "72% green spaces", "Lakes and parks"],
    rating: 9.2
  },
  {
    name: "DAMAC Islands",
    developer: "DAMAC",
    location: "DAMAC Islands",
    priceFrom: "AED 450,000",
    type: "Studios-3 BR",
    handover: "Q4 2027",
    paymentPlan: "80/20",
    expectedRoi: "25-35%",
    highlights: ["Entry-level pricing", "Resort-style living", "Island concept"],
    rating: 8.9
  },
  {
    name: "Palm Jebel Ali Beach Residences",
    developer: "Nakheel",
    location: "Palm Jebel Ali",
    priceFrom: "AED 2,200,000",
    type: "2-4 BR Apartments",
    handover: "Q1 2028",
    paymentPlan: "60/40",
    expectedRoi: "30-40%",
    highlights: ["New Palm Island", "Beachfront living", "Master community"],
    rating: 9.4
  },
  {
    name: "Binghatti Luna",
    developer: "Binghatti",
    location: "Business Bay",
    priceFrom: "AED 750,000",
    type: "Studios-2 BR",
    handover: "Q3 2026",
    paymentPlan: "80/20",
    expectedRoi: "20-25%",
    highlights: ["Iconic architecture", "Central location", "Rental demand"],
    rating: 8.7
  },
  {
    name: "Rove Home JVC",
    developer: "Rove",
    location: "JVC",
    priceFrom: "AED 600,000",
    type: "Studios-1 BR",
    handover: "Q4 2026",
    paymentPlan: "1% Monthly",
    expectedRoi: "28-35%",
    highlights: ["Highest JVC yields", "Hotel-style amenities", "Young investor favorite"],
    rating: 8.8
  },
  {
    name: "Ellington Beach House",
    developer: "Ellington",
    location: "Palm Jumeirah",
    priceFrom: "AED 3,800,000",
    type: "2-4 BR Apartments",
    handover: "Q2 2027",
    paymentPlan: "50/50",
    expectedRoi: "15-20%",
    highlights: ["Premium Palm location", "Design-led developer", "Beach access"],
    rating: 9.1
  },
];

const INVESTMENT_CATEGORIES = [
  {
    title: "Best for First-Time Investors",
    projects: ["DAMAC Islands", "Rove Home JVC", "Binghatti Luna"],
    budget: "AED 450K-750K",
    why: "Low entry point, strong payment plans, high rental yields"
  },
  {
    title: "Best for Rental Income",
    projects: ["Rove Home JVC", "Binghatti Luna", "Sobha One"],
    budget: "AED 600K-1.2M",
    why: "Prime rental locations, studio/1BR units, 8-10% yields"
  },
  {
    title: "Best for Capital Growth",
    projects: ["Palm Jebel Ali Beach", "Dubai Creek Residences", "The Acres"],
    budget: "AED 1.4M-3.5M",
    why: "New master communities, early-stage pricing, 25-40% appreciation"
  },
  {
    title: "Best for Luxury Living",
    projects: ["Ellington Beach House", "Dubai Creek Residences", "The Acres"],
    budget: "AED 3M+",
    why: "Premium developers, iconic locations, lifestyle value"
  },
];

const RELATED_LINKS = [
  { title: "Investment Guide", href: "/dubai-off-plan-investment-guide", description: "ROI strategies" },
  { title: "How to Buy", href: "/how-to-buy-dubai-off-plan", description: "Purchase process" },
  { title: "Payment Plans", href: "/dubai-off-plan-payment-plans", description: "Financing options" },
  { title: "Business Bay Projects", href: "/dubai-off-plan-business-bay", description: "Central location" },
  { title: "JVC Projects", href: "/dubai-off-plan-jvc", description: "Highest yields" },
];

export default function OffPlanBest2025() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    document.title = "Best Off-Plan Projects Dubai 2025 | Top 10 Investment Opportunities";
  }, []);

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Best 2025" }
      ]} />
      <OffPlanSubNav activeHref="/best-off-plan-projects-dubai-2025" />

      <main className="bg-background">
        {/* Hero */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Updated January 2025</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Best Off-Plan Projects Dubai 2025
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Expert-curated selection of top investment opportunities with detailed ROI projections, 
              payment plans, and market analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="rounded-full" data-testid="button-get-shortlist">
                <Building2 className="w-5 h-5 mr-2" />
                Get Personalized Shortlist
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold">8 Projects</p>
                <p className="text-sm text-muted-foreground">Top Picks</p>
              </Card>
              <Card className="p-4 text-center">
                <Wallet className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold">AED 450K</p>
                <p className="text-sm text-muted-foreground">Starting From</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold">20-40%</p>
                <p className="text-sm text-muted-foreground">Expected ROI</p>
              </Card>
              <Card className="p-4 text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold">2026-2028</p>
                <p className="text-sm text-muted-foreground">Handover Range</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Top Projects */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Top 8 Projects for 2025</h2>
            <p className="text-muted-foreground mb-8">
              Selected based on developer track record, location potential, and ROI outlook
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {TOP_PROJECTS_2025.map((project, index) => (
                <Card key={project.name} className="p-6 relative">
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="font-bold">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {project.developer} | {project.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-semibold text-primary">{project.priceFrom}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium">{project.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Handover</p>
                      <p className="font-medium">{project.handover}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payment</p>
                      <p className="font-medium">{project.paymentPlan}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-green-600/90">{project.expectedRoi} ROI</Badge>
                    <Badge variant="outline">
                      <Bitcoin className="w-3 h-3 mr-1" />
                      Crypto OK
                    </Badge>
                  </div>

                  <ul className="space-y-1 mb-4">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold">{project.rating}</span>
                      <span className="text-xs text-muted-foreground">/10</span>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-details-${index}`}>
                      Get Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Categories */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Projects by Investment Goal</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Matched recommendations based on your objectives
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {INVESTMENT_CATEGORIES.map((cat) => (
                <Card key={cat.title} className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">{cat.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{cat.why}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {cat.projects.map((p) => (
                      <Badge key={p} variant="secondary">{p}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Budget: <span className="font-medium">{cat.budget}</span>
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <TrustSignals />
        <RelatedLinks title="Related Guides" links={RELATED_LINKS} />

        <OffPlanCTASection
          title="Get Your Personalized Shortlist"
          subtitle="Receive tailored project recommendations based on your investment goals and budget"
          ctaText="Get Free Consultation"
          onCtaClick={() => setWizardOpen(true)}
        />
      </main>
    </>
  );
}
