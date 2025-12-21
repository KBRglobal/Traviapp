import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, Building, Award, TrendingUp, Clock, Shield } from "lucide-react";
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

const comparisonTable = [
  { factor: "Founded", emaar: "1997", damac: "2002", winner: "emaar" },
  { factor: "On-Time Delivery", emaar: "95%", damac: "88%", winner: "emaar" },
  { factor: "Average ROI", emaar: "24%", damac: "19%", winner: "emaar" },
  { factor: "Entry Price", emaar: "AED 1.6M", damac: "AED 550K", winner: "damac" },
  { factor: "Payment Flexibility", emaar: "10/70/20", damac: "60/40, 70/30, 80/20", winner: "damac" },
  { factor: "Post-Handover Plans", emaar: "Limited", damac: "Up to 5 years", winner: "damac" },
  { factor: "Brand Recognition", emaar: "Burj Khalifa Developer", damac: "Celebrity Partnerships", winner: "emaar" },
  { factor: "Resale Value", emaar: "Premium", damac: "Competitive", winner: "emaar" },
  { factor: "Project Variety", emaar: "Focused on Premium", damac: "All Segments", winner: "damac" },
  { factor: "Crypto Payments", emaar: "Limited", damac: "Widely Accepted", winner: "damac" },
];

const emaarStats = [
  { label: "On-Time Delivery", value: "95%" },
  { label: "Average ROI", value: "24%" },
  { label: "Projects Delivered", value: "80+" },
  { label: "Entry Price", value: "AED 1.6M" }
];

const damacStats = [
  { label: "On-Time Delivery", value: "88%" },
  { label: "Average ROI", value: "19%" },
  { label: "Projects Delivered", value: "100+" },
  { label: "Entry Price", value: "AED 550K" }
];

const emaarProjects = [
  { name: "Rosehill", location: "Dubai Hills", price: "AED 1.6M", handover: "Q2 2029" },
  { name: "Creek Haven", location: "Creek Harbour", price: "AED 1.95M", handover: "Q1 2030" },
  { name: "Avarra by Palace", location: "Business Bay", price: "AED 2.7M", handover: "Q2 2031" },
  { name: "Ovelle", location: "The Valley", price: "AED 7.09M", handover: "Q4 2029" }
];

const damacProjects = [
  { name: "Damac Lagoons Santorini", location: "Damac Lagoons", price: "AED 1.2M", handover: "Q3 2026" },
  { name: "Damac Hills 2", location: "Akoya", price: "AED 550K", handover: "Q4 2026" },
  { name: "Damac Bay", location: "Dubai Harbour", price: "AED 1.8M", handover: "Q1 2027" },
  { name: "Damac Safa Two", location: "Business Bay", price: "AED 1.4M", handover: "Q2 2026" }
];

export default function CompareEmaarVsDamac() {
  useDocumentMeta({
    title: "Emaar vs DAMAC | Dubai Developer Comparison 2026",
    description: "Compare Emaar and DAMAC properties in Dubai. Emaar offers 95% on-time delivery with 24% ROI. DAMAC provides flexible payments from AED 550K. Complete developer analysis.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "Emaar vs DAMAC" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Developer Comparison
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                  2026 Analysis
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Emaar vs DAMAC: Developer Comparison 2026
              </h1>
              <p className="text-lg md:text-xl text-amber-100 mb-6 max-w-3xl">
                Emaar and DAMAC are Dubai's leading property developers with different strengths. 
                Emaar offers premium reliability with 95% on-time delivery. DAMAC provides 
                flexible payment plans and lower entry prices. Compare to find your ideal developer.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-emaar">
                  <Button size="lg" data-testid="button-explore-emaar">
                    Explore Emaar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/off-plan-damac">
                  <Button size="lg" variant="outline" data-testid="button-explore-damac">
                    Explore DAMAC
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Developer Profiles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-amber-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  Emaar Properties
                </CardTitle>
                <p className="text-sm text-muted-foreground">Creator of Burj Khalifa, Dubai Mall</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {emaarStats.map((stat, index) => (
                    <div key={index} className="text-center p-3 rounded-md bg-amber-500/10">
                      <div className="text-xl font-bold text-amber-600">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Premium brand with highest resale values
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Industry-leading on-time delivery rate
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Prime locations: Downtown, Creek Harbour, Hills
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-red-600" />
                  DAMAC Properties
                </CardTitle>
                <p className="text-sm text-muted-foreground">Luxury living with lifestyle partnerships</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {damacStats.map((stat, index) => (
                    <div key={index} className="text-center p-3 rounded-md bg-red-500/10">
                      <div className="text-xl font-bold text-red-600">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Most flexible payment plans in market
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Lower entry prices from AED 550K
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Post-handover plans up to 5 years
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Head-to-Head Comparison</h2>
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Factor</th>
                    <th className="text-left py-3 px-4 font-semibold bg-amber-500/5">Emaar</th>
                    <th className="text-left py-3 px-4 font-semibold bg-red-500/5">DAMAC</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'emaar' ? 'bg-green-500/10' : 'bg-amber-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'emaar' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.emaar}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'damac' ? 'bg-green-500/10' : 'bg-red-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'damac' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.damac}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'emaar' ? 'default' : 'secondary'}>
                          {row.winner === 'emaar' ? 'Emaar' : 'DAMAC'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Score: Emaar wins 5 categories | DAMAC wins 5 categories
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-600" />
                Emaar Featured Projects
              </h3>
              <div className="space-y-3">
                {emaarProjects.map((project, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-amber-600">{project.price}</div>
                          <div className="text-xs text-muted-foreground">{project.handover}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building className="h-4 w-4 text-red-600" />
                DAMAC Featured Projects
              </h3>
              <div className="space-y-3">
                {damacProjects.map((project, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-red-600">{project.price}</div>
                          <div className="text-xs text-muted-foreground">{project.handover}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Which Developer Is Right for You?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-amber-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Emaar If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize on-time delivery and reliability
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want premium brand value for resale
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have larger budget (AED 1.6M+)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer prime locations like Downtown
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose DAMAC If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Need flexible payment terms
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have smaller budget (AED 550K+)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want post-handover payment plans
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer paying with cryptocurrency
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Get Developer-Specific Guidance"
          subtitle="Connect with consultants specializing in Emaar and DAMAC properties. Expert advice on the best projects for your investment goals."
          ctaText="Get Expert Advice"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Developer Guides"
          links={[
            { href: "/off-plan-emaar", title: "Emaar Properties" },
            { href: "/off-plan-damac", title: "DAMAC Properties" },
            { href: "/off-plan-nakheel", title: "Nakheel" },
            { href: "/off-plan-sobha", title: "Sobha Realty" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/best-off-plan-projects-dubai-2026", title: "Best Projects 2026" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
