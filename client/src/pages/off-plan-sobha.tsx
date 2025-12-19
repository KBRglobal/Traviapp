import { Link } from "wouter";
import { Building, ChevronRight, Clock, MapPin, Star, TrendingUp, Award, Gem, Calendar, Trees, CheckCircle } from "lucide-react";
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

const sobhaProjects = [
  { name: "Sobha Hartland II", location: "MBR City", type: "Apartments", price: "AED 1.2M", completion: "Q2 2026", roi: "23%" },
  { name: "Sobha Reserve", location: "Wadi Al Safa", type: "Villas", price: "AED 6.5M", completion: "Q4 2027", roi: "20%" },
  { name: "Sobha One", location: "Sobha Hartland", type: "Towers", price: "AED 1.8M", completion: "Q1 2026", roi: "22%" },
  { name: "Sobha SeaHaven", location: "Dubai Harbour", type: "Waterfront", price: "AED 2.5M", completion: "Q3 2026", roi: "21%" },
  { name: "The Crest", location: "Sobha Hartland", type: "Premium Apartments", price: "AED 2.2M", completion: "Q2 2026", roi: "22%" },
  { name: "Sobha Elwood", location: "Sobha Hartland", type: "Townhouses", price: "AED 3.8M", completion: "Q4 2025", roi: "19%" }
];

const qualityStandards = [
  { aspect: "Backward Integration", description: "Own manufacturing for marble, glass, timber & interiors" },
  { aspect: "In-House Expertise", description: "7,000+ skilled craftsmen across disciplines" },
  { aspect: "Quality Control", description: "ISO 9001:2015 certified processes" },
  { aspect: "Green Building", description: "LEED certified sustainable developments" },
  { aspect: "Finishing Standards", description: "Premium European fixtures and fittings" },
  { aspect: "Warranty", description: "10-year structural warranty on all properties" }
];

export default function OffPlanSobha() {
  useDocumentMeta({
    title: "Sobha Realty Dubai | Premium Off-Plan Projects 2025",
    description: "Explore Sobha Realty off-plan properties in Dubai. Known for exceptional quality with 94% on-time delivery and 22% average ROI. Luxury apartments and villas from AED 1.2M.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Developers", href: "/dubai-off-plan-properties" },
    { label: "Sobha" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-sobha" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  <Gem className="h-3 w-3 mr-1" />
                  Quality Pioneer
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                  94% On-Time Delivery
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Sobha Realty Dubai
              </h1>
              <p className="text-lg md:text-xl text-emerald-100 mb-6 max-w-3xl">
                India's most trusted luxury developer now in Dubai. Sobha Realty is renowned for 
                backward integration - manufacturing their own materials for unmatched quality control. 
                Experience precision craftsmanship with industry-leading delivery records and premium finishes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-view-sobha-projects">
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
              <div className="text-2xl font-bold">22%</div>
              <div className="text-sm text-muted-foreground">Avg. ROI</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Trees className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">8M</div>
              <div className="text-sm text-muted-foreground">Sq Ft Hartland</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Gem className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">7,000+</div>
              <div className="text-sm text-muted-foreground">Craftsmen</div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Sobha Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sobhaProjects.map((project, index) => (
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
          <h2 className="text-2xl font-bold mb-6">Sobha Quality Standards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qualityStandards.map((standard, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Gem className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{standard.aspect}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{standard.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Invest with Sobha?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Unmatched Quality
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Backward integration ensures quality control
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Own manufacturing for marble, timber, glass
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Premium European fixtures as standard
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    10-year structural warranty included
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
                    Sobha Hartland - prime MBR City location
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Strong rental demand from quality seekers
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Consistent capital appreciation track record
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Flexible 60/40 and 70/30 payment plans
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Sobha Hartland Masterplan</h3>
              <p className="text-muted-foreground mb-4">
                An 8-million sq ft freehold community in Mohammed Bin Rashid City featuring:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Trees className="h-4 w-4 text-green-500" />
                  <span className="text-sm">30% green open spaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">International schools</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Retail boulevard</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Invest in Sobha Premium Properties"
          subtitle="Access exclusive Sobha off-plan projects with flexible payment plans and crypto payment options (BTC, USDT, ETH)."
          ctaText="Get Expert Consultation"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Developer Pages"
          links={[
            { href: "/off-plan-emaar", title: "Emaar Properties" },
            { href: "/off-plan-damac", title: "DAMAC Properties" },
            { href: "/off-plan-nakheel", title: "Nakheel" },
            { href: "/off-plan-meraas", title: "Meraas" },
            { href: "/dubai-off-plan-business-bay", title: "Business Bay Projects" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
