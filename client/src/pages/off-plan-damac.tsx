import { Link } from "wouter";
import { Building, ChevronRight, Clock, MapPin, Star, TrendingUp, Award, Users, Calendar, Sparkles, CheckCircle } from "lucide-react";
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

const damacProjects = [
  { name: "DAMAC Lagoons", location: "DAMAC Hills 2", type: "Villas", price: "AED 1.5M", completion: "Q3 2025", roi: "21%" },
  { name: "Cavalli Tower", location: "Dubai Marina", type: "Luxury Apartments", price: "AED 2.8M", completion: "Q1 2027", roi: "18%" },
  { name: "Safa Two by de Grisogono", location: "Business Bay", type: "Ultra-Luxury", price: "AED 5.5M", completion: "Q4 2026", roi: "17%" },
  { name: "DAMAC Bay by Cavalli", location: "Dubai Harbour", type: "Waterfront", price: "AED 3.2M", completion: "Q2 2027", roi: "19%" },
  { name: "The Enclaves", location: "DAMAC Hills", type: "Townhouses", price: "AED 1.9M", completion: "Q1 2026", roi: "20%" },
  { name: "DAMAC Riverside", location: "Dubai South", type: "Apartments", price: "AED 750K", completion: "Q4 2025", roi: "22%" }
];

const brandPartnerships = [
  { brand: "Cavalli", type: "Fashion House", project: "Cavalli Tower, DAMAC Bay" },
  { brand: "de Grisogono", type: "Swiss Jewelry", project: "Safa Two" },
  { brand: "Versace", type: "Italian Fashion", project: "DAMAC Towers by Paramount" },
  { brand: "Fendi", type: "Luxury Fashion", project: "FENDI Private Residences" },
  { brand: "Radisson", type: "Hospitality", project: "DAMAC Maison Hotels" },
  { brand: "Trump", type: "Hospitality", project: "Trump DAMAC Golf Estates" }
];

export default function OffPlanDamac() {
  useDocumentMeta({
    title: "DAMAC Properties Dubai | Luxury Off-Plan Projects 2025",
    description: "Discover DAMAC luxury off-plan properties in Dubai. Designer residences with Cavalli, Versace & Fendi. 88% on-time delivery. Apartments from AED 750K with branded interiors.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Developers", href: "/dubai-off-plan-properties" },
    { label: "DAMAC" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-damac" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Luxury Developer
                </Badge>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-200 border-pink-400/30">
                  Designer Partnerships
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                DAMAC Properties Dubai
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mb-6 max-w-3xl">
                Pioneer of luxury branded residences in the Middle East. DAMAC Properties partners with 
                world-renowned fashion houses including Versace, Fendi, and Cavalli to deliver 
                unparalleled luxury living experiences with exceptional design and craftsmanship.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-view-damac-projects">
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
              <div className="text-2xl font-bold">19%</div>
              <div className="text-sm text-muted-foreground">Avg. ROI</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">88%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">45K+</div>
              <div className="text-sm text-muted-foreground">Units Delivered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">6+</div>
              <div className="text-sm text-muted-foreground">Brand Partners</div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured DAMAC Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {damacProjects.map((project, index) => (
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
          <h2 className="text-2xl font-bold mb-6">Luxury Brand Partnerships</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandPartnerships.map((partnership, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{partnership.brand}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">{partnership.type}</div>
                  <div className="text-sm">{partnership.project}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Invest with DAMAC?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Luxury Specialization
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Exclusive partnerships with global fashion houses
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Designer interiors with premium finishes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Five-star hospitality-inspired amenities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Strong resale value from brand prestige
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
                    Flexible payment plans up to 80/20 structures
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Projects in high-demand premium locations
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    DAMAC Hotels & Resorts rental management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Listed on London Stock Exchange
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Invest in DAMAC Luxury Properties"
          subtitle="Access exclusive DAMAC branded residences with flexible payment plans and crypto payment options (BTC, USDT, ETH)."
          ctaText="Get Expert Consultation"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Developer Pages"
          links={[
            { href: "/off-plan-emaar", title: "Emaar Properties" },
            { href: "/off-plan-nakheel", title: "Nakheel" },
            { href: "/off-plan-meraas", title: "Meraas" },
            { href: "/off-plan-sobha", title: "Sobha Realty" },
            { href: "/dubai-off-plan-marina", title: "Dubai Marina Projects" },
            { href: "/dubai-off-plan-business-bay", title: "Business Bay Projects" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
