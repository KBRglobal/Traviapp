import { Link } from "wouter";
import { Building, ChevronRight, Clock, MapPin, Star, TrendingUp, Award, Palette, Calendar, Landmark, CheckCircle } from "lucide-react";
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

const meraasProjects = [
  { name: "Bluewaters Residences", location: "Bluewaters Island", type: "Apartments", price: "AED 2.2M", completion: "Delivered", roi: "19%" },
  { name: "Port de La Mer", location: "La Mer", type: "Waterfront", price: "AED 1.8M", completion: "Q2 2026", roi: "22%" },
  { name: "The Address Jumeirah", location: "City Walk", type: "Hotel Residences", price: "AED 3.5M", completion: "Q4 2026", roi: "21%" },
  { name: "Bvlgari Marina Lofts", location: "Bvlgari Resort", type: "Ultra-Luxury", price: "AED 8M", completion: "Q1 2027", roi: "18%" },
  { name: "Cherrywoods Townhouses", location: "Al Qudra", type: "Townhouses", price: "AED 1.5M", completion: "Q3 2026", roi: "24%" },
  { name: "Nad Al Sheba Gardens", location: "Nad Al Sheba", type: "Villas", price: "AED 2.8M", completion: "Q4 2025", roi: "23%" }
];

const lifestyleDestinations = [
  { name: "City Walk", type: "Urban District", description: "Open-air retail and residential destination" },
  { name: "La Mer", type: "Beachfront", description: "Coastal living with beach club lifestyle" },
  { name: "Bluewaters Island", type: "Island Living", description: "Home to Ain Dubai - world's largest observation wheel" },
  { name: "Boxpark", type: "Retail Concept", description: "Container-style urban marketplace" },
  { name: "Last Exit", type: "Food Trucks", description: "Highway food truck destinations" },
  { name: "Kite Beach", type: "Beach Lifestyle", description: "Active lifestyle beachfront community" }
];

export default function OffPlanMeraas() {
  useDocumentMeta({
    title: "Meraas Dubai | Lifestyle Developer - Off-Plan Projects 2025",
    description: "Discover Meraas lifestyle-focused off-plan properties in Dubai. Creators of City Walk, Bluewaters & La Mer. 92% on-time delivery. Premium destinations from AED 1.5M.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Developers", href: "/dubai-off-plan-properties" },
    { label: "Meraas" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-meraas" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-rose-900 via-pink-800 to-orange-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-rose-500/20 text-rose-200 border-rose-400/30">
                  <Palette className="h-3 w-3 mr-1" />
                  Lifestyle Developer
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                  92% On-Time Delivery
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Meraas Dubai
              </h1>
              <p className="text-lg md:text-xl text-rose-100 mb-6 max-w-3xl">
                Creators of Dubai's most vibrant lifestyle destinations including City Walk, Bluewaters Island, 
                and La Mer. Meraas transforms urban spaces into experiential communities where residents 
                live, work, and play in thoughtfully designed environments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-view-meraas-projects">
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
              <div className="text-2xl font-bold">23%</div>
              <div className="text-sm text-muted-foreground">Avg. ROI</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">92%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Landmark className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm text-muted-foreground">Destinations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">Bvlgari</div>
              <div className="text-sm text-muted-foreground">Partner</div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Meraas Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meraasProjects.map((project, index) => (
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
          <h2 className="text-2xl font-bold mb-6">Meraas Lifestyle Destinations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lifestyleDestinations.map((destination, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{destination.name}</span>
                  </div>
                  <Badge variant="outline" className="mb-2">{destination.type}</Badge>
                  <div className="text-sm text-muted-foreground">{destination.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Invest with Meraas?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Lifestyle Focus
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Integrated live-work-play communities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Premium retail and dining within developments
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Unique architectural design identity
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Government-backed holding company
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Investment Advantages
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    High-footfall destinations drive rental demand
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Strong capital appreciation in established areas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Bvlgari partnership for ultra-luxury segment
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
          title="Invest in Meraas Lifestyle Properties"
          subtitle="Access exclusive Meraas off-plan projects with flexible payment plans and crypto payment options (BTC, USDT, ETH)."
          ctaText="Get Expert Consultation"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Developer Pages"
          links={[
            { href: "/off-plan-emaar", title: "Emaar Properties" },
            { href: "/off-plan-damac", title: "DAMAC Properties" },
            { href: "/off-plan-nakheel", title: "Nakheel" },
            { href: "/off-plan-sobha", title: "Sobha Realty" },
            { href: "/dubai-off-plan-marina", title: "Dubai Marina Projects" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
