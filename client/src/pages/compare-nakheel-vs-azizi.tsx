import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, Building, Palmtree, TrendingUp, MapPin } from "lucide-react";
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
  { factor: "1-BR Starting Price", nakheel: "AED 1.2M", azizi: "AED 650K", winner: "azizi" },
  { factor: "Rental Yield", nakheel: "5.5%", azizi: "7.2%", winner: "azizi" },
  { factor: "Iconic Locations", nakheel: "Palm, Islands", azizi: "MBR City, Downtown", winner: "nakheel" },
  { factor: "Price per Sqft", nakheel: "AED 1,600", azizi: "AED 1,100", winner: "azizi" },
  { factor: "Government Backing", nakheel: "State-owned", azizi: "Private", winner: "nakheel" },
  { factor: "Payment Plans", nakheel: "50/50", azizi: "60/40, 80/20", winner: "azizi" },
  { factor: "Project Volume", nakheel: "Moderate", azizi: "Very High", winner: "azizi" },
  { factor: "Waterfront Access", nakheel: "Extensive", azizi: "Limited", winner: "nakheel" },
  { factor: "Delivery Track Record", nakheel: "Strong", azizi: "Good", winner: "nakheel" },
  { factor: "Investor Entry", nakheel: "Mid-High", azizi: "Entry Level", winner: "azizi" },
];

export default function CompareNakheelVsAzizi() {
  useDocumentMeta({
    title: "Nakheel vs Azizi | Dubai Developer Comparison 2026",
    description: "Compare Nakheel and Azizi developers. Nakheel offers iconic waterfronts from AED 1.2M. Azizi delivers high yields from AED 650K. Full investment analysis.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "Nakheel vs Azizi" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-cyan-900 via-teal-800 to-emerald-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Developer Comparison
                </Badge>
                <Badge variant="secondary" className="bg-teal-500/20 text-teal-200 border-teal-400/30">
                  Different Strategies
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Nakheel vs Azizi: Investment Analysis
              </h1>
              <p className="text-lg md:text-xl text-cyan-100 mb-6 max-w-3xl">
                Two developers with distinct strategies. Nakheel creates iconic waterfront 
                destinations from AED 1.2M. Azizi focuses on volume and yield from AED 650K. 
                Which aligns with your investment goals?
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-nakheel">
                  <Button size="lg" data-testid="button-nakheel">
                    <Palmtree className="mr-2 h-4 w-4" />
                    Nakheel Projects
                  </Button>
                </Link>
                <Link href="/off-plan-azizi">
                  <Button size="lg" variant="outline" data-testid="button-azizi">
                    Azizi Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-cyan-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palmtree className="h-5 w-5 text-cyan-600" />
                  Nakheel
                </CardTitle>
                <p className="text-sm text-muted-foreground">Government-backed iconic developer</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-cyan-500/10">
                    <div className="text-xl font-bold text-cyan-600">AED 1.2M</div>
                    <div className="text-xs text-muted-foreground">1-BR from</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-cyan-500/10">
                    <div className="text-xl font-bold text-cyan-600">5.5%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Palm Jumeirah, World Islands creator
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    State-owned developer stability
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Premium waterfront locations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-emerald-600" />
                  Azizi Developments
                </CardTitle>
                <p className="text-sm text-muted-foreground">High-volume yield-focused developer</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-emerald-500/10">
                    <div className="text-xl font-bold text-emerald-600">AED 650K</div>
                    <div className="text-xs text-muted-foreground">1-BR from</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-emerald-500/10">
                    <div className="text-xl font-bold text-emerald-600">7.2%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Affordable entry points
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Strong rental yields focus
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    MBR City, Downtown projects
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
                    <th className="text-left py-3 px-4 font-semibold bg-cyan-500/5">Nakheel</th>
                    <th className="text-left py-3 px-4 font-semibold bg-emerald-500/5">Azizi</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'nakheel' ? 'bg-green-500/10' : 'bg-cyan-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'nakheel' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.nakheel}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'azizi' ? 'bg-green-500/10' : 'bg-emerald-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'azizi' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.azizi}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'nakheel' ? 'default' : 'secondary'}>
                          {row.winner === 'nakheel' ? 'Nakheel' : 'Azizi'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Investment Verdict</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-cyan-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Nakheel If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want iconic waterfront addresses
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Value government backing stability
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize capital appreciation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Seek luxury lifestyle investments
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Azizi If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize rental yield
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have lower budget entry
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want flexible payment plans
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Seek volume-based diversification
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Explore Developer Projects"
          subtitle="Connect with consultants who can guide you through Nakheel and Azizi project portfolios."
          ctaText="Get Developer Guidance"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Developer Guides"
          links={[
            { href: "/off-plan-nakheel", title: "Nakheel Properties" },
            { href: "/off-plan-azizi", title: "Azizi Projects" },
            { href: "/compare-emaar-vs-damac", title: "Emaar vs DAMAC" },
            { href: "/compare-sobha-vs-meraas", title: "Sobha vs Meraas" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
