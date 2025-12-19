import { Link } from "wouter";
import { Building, ChevronRight, Clock, MapPin, Star, TrendingUp, Award, Waves, Calendar, Palmtree, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  OffPlanStatsBar, 
  OffPlanBreadcrumb, 
  OffPlanSubNav, 
  OffPlanCTASection, 
  RelatedLinks,
  TrustSignals 
} from "@/components/off-plan-shared";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const nakheelProjects = [
  { name: "Palm Jebel Ali", location: "Palm Jebel Ali", type: "Villas", price: "AED 15M", completion: "Q4 2028", roi: "25%" },
  { name: "Como Residences", location: "Palm Jumeirah", type: "Ultra-Luxury", price: "AED 21M", completion: "Q2 2027", roi: "18%" },
  { name: "Rixos Hotel Residences", location: "Palm Jumeirah", type: "Hotel Apartments", price: "AED 4.5M", completion: "Q3 2026", roi: "20%" },
  { name: "Palm Beach Towers 3", location: "Palm Jumeirah", type: "Beachfront Apartments", price: "AED 3.8M", completion: "Q1 2027", roi: "19%" },
  { name: "Dragon City Phase 2", location: "International City", type: "Apartments", price: "AED 550K", completion: "Q4 2025", roi: "23%" },
  { name: "Veneto", location: "Jumeirah Village Circle", type: "Apartments", price: "AED 850K", completion: "Q2 2026", roi: "21%" }
];

const iconicProjects = [
  { name: "Palm Jumeirah", description: "World's largest man-made island, visible from space", units: "4,000+ villas" },
  { name: "The World Islands", description: "300 artificial islands forming world map", units: "Premium island retreats" },
  { name: "Deira Islands", description: "Four man-made islands spanning 15.3 sq km", units: "Mixed-use development" },
  { name: "Ibn Battuta Mall", description: "Themed shopping destination", units: "1M+ sq ft retail" },
  { name: "Dragon City", description: "Largest Chinese trading hub outside China", units: "5,000+ trading units" }
];

export default function OffPlanNakheel() {
  useDocumentMeta({
    title: "Nakheel Dubai | Palm Jumeirah Developer - Off-Plan Projects 2025",
    description: "Explore Nakheel off-plan properties in Dubai. Creators of Palm Jumeirah and The World Islands. 91% on-time delivery. Premium waterfront villas and apartments from AED 550K.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Developers", href: "/dubai-off-plan-properties" },
    { label: "Nakheel" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-nakheel" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-cyan-900 via-teal-800 to-emerald-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30">
                  <Palmtree className="h-3 w-3 mr-1" />
                  Waterfront Specialist
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  91% On-Time Delivery
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Nakheel Dubai
              </h1>
              <p className="text-lg md:text-xl text-cyan-100 mb-6 max-w-3xl">
                Creators of Palm Jumeirah, The World Islands, and Dubai's most iconic waterfront destinations. 
                Nakheel is the master developer behind landmarks visible from space, transforming Dubai's 
                coastline into the world's most sought-after real estate.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-view-nakheel-projects">
                  View All Projects
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

        <section className="grid md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">21%</div>
              <div className="text-sm text-muted-foreground">Avg. ROI</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">91%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Waves className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">300+</div>
              <div className="text-sm text-muted-foreground">Islands Created</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">80K+</div>
              <div className="text-sm text-muted-foreground">Units Delivered</div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Nakheel Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nakheelProjects.map((project, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant="secondary">{project.roi} ROI</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {project.type}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {project.completion}
                    </div>
                    <div className="pt-2 font-semibold text-primary">From {project.price}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Iconic Nakheel Developments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {iconicProjects.map((project, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Palmtree className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{project.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{project.description}</div>
                  <div className="text-sm font-medium">{project.units}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Invest with Nakheel?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Waterfront Excellence
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Created 300+ islands including Palm Jumeirah
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Direct beach access and marina berths
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Exclusive waterfront villa plots
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Government-backed master developer
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Investment Benefits
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Premium locations with scarcity value
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Strong capital appreciation history
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    High rental yields in tourist areas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Flexible payment plans available
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Invest in Nakheel Waterfront Properties"
          subtitle="Access exclusive Nakheel off-plan projects with flexible payment plans and crypto payment options (BTC, USDT, ETH)."
          ctaText="Get Expert Consultation"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Developer Pages"
          links={[
            { href: "/off-plan-emaar", title: "Emaar Properties" },
            { href: "/off-plan-damac", title: "DAMAC Properties" },
            { href: "/off-plan-meraas", title: "Meraas" },
            { href: "/off-plan-sobha", title: "Sobha Realty" },
            { href: "/dubai-off-plan-palm-jumeirah", title: "Palm Jumeirah Projects" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
