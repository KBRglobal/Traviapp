import { Link } from "wouter";
import { Building, ChevronRight, Clock, MapPin, Star, TrendingUp, Award, Users, Calendar, Shield, CheckCircle } from "lucide-react";
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

const emaarProjects = [
  { name: "The Valley Phase 3", location: "Dubai Hills", type: "Townhouses", price: "AED 1.8M", completion: "Q4 2026", roi: "22%" },
  { name: "Creek Waters", location: "Creek Harbour", type: "Apartments", price: "AED 1.2M", completion: "Q2 2027", roi: "24%" },
  { name: "Rashid Yachts & Marina", location: "Port Rashid", type: "Waterfront", price: "AED 2.5M", completion: "Q1 2027", roi: "26%" },
  { name: "Address Residences Downtown", location: "Downtown Dubai", type: "Luxury Apartments", price: "AED 3.2M", completion: "Q3 2026", roi: "21%" },
  { name: "Greenridge", location: "Emaar South", type: "Villas", price: "AED 2.1M", completion: "Q4 2026", roi: "20%" },
  { name: "Palace Beach Residence", location: "Emaar Beachfront", type: "Beachfront", price: "AED 4.8M", completion: "Q2 2026", roi: "19%" }
];

const emaarMilestones = [
  { year: "1997", event: "Emaar Properties founded in Dubai" },
  { year: "2004", event: "Burj Khalifa construction begins - world's tallest building" },
  { year: "2010", event: "Burj Khalifa completion, Dubai Mall opening" },
  { year: "2017", event: "Dubai Creek Tower announced - future world's tallest" },
  { year: "2020", event: "Launched Address Hotels & Resorts globally" },
  { year: "2024", event: "50+ ongoing projects across UAE and international markets" }
];

export default function OffPlanEmaar() {
  useDocumentMeta({
    title: "Emaar Properties Dubai | Off-Plan Projects & Developer Guide 2026",
    description: "Explore Emaar off-plan properties in Dubai. Premium developments with 95% on-time delivery and 24% average ROI. From Burj Khalifa creators - luxury apartments, villas & waterfront homes.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Developers", href: "/dubai-off-plan-properties" },
    { label: "Emaar" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-emaar" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  <Award className="h-3 w-3 mr-1" />
                  Master Developer
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                  95% On-Time Delivery
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Emaar Properties Dubai
              </h1>
              <p className="text-lg md:text-xl text-amber-100 mb-6 max-w-3xl">
                Creators of Burj Khalifa, Dubai Mall, and Dubai Marina - Emaar Properties is the Middle East's 
                largest and most trusted real estate developer. Experience world-class craftsmanship with 
                industry-leading delivery records and exceptional investment returns.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-view-emaar-projects">
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
              <div className="text-2xl font-bold">24%</div>
              <div className="text-sm text-muted-foreground">Avg. ROI</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">60+</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">500K+</div>
              <div className="text-sm text-muted-foreground">Happy Residents</div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Emaar Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emaarProjects.map((project, index) => (
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
          <h2 className="text-2xl font-bold mb-6">Why Invest with Emaar?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Proven Track Record
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Delivered over 85,000 residential units since 1997
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Built Burj Khalifa - world's tallest building at 828m
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Created Dubai Marina - largest man-made marina globally
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Publicly listed on Dubai Financial Market (DFM)
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
                    Premium locations with proven appreciation potential
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    World-class amenities and finishing standards
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Strong rental demand from Address Hotels tenants
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Flexible payment plans with 60/40 or 70/30 structures
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Emaar Company Milestones</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {emaarMilestones.map((milestone, index) => (
                <div key={index} className="relative pl-12">
                  <div className="absolute left-2 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                  <div className="text-sm text-muted-foreground">{milestone.year}</div>
                  <div className="font-medium">{milestone.event}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <OffPlanCTASection
          title="Invest in Emaar Properties"
          subtitle="Access exclusive Emaar off-plan projects with flexible payment plans and crypto payment options (BTC, USDT, ETH)."
          ctaText="Get Expert Consultation"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Developer Pages"
          links={[
            { href: "/off-plan-damac", title: "DAMAC Properties" },
            { href: "/off-plan-nakheel", title: "Nakheel" },
            { href: "/off-plan-meraas", title: "Meraas" },
            { href: "/off-plan-sobha", title: "Sobha Realty" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/dubai-off-plan-creek-harbour", title: "Creek Harbour Projects" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
