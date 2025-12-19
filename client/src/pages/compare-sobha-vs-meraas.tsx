import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, Building, Gem, TrendingUp, MapPin } from "lucide-react";
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
  { factor: "1-BR Starting Price", sobha: "AED 1.4M", meraas: "AED 1.8M", winner: "sobha" },
  { factor: "Interior Quality", sobha: "Ultra-Premium", meraas: "Ultra-Premium", winner: "tie" },
  { factor: "Architectural Style", sobha: "Contemporary Elegant", meraas: "Bold Modern", winner: "tie" },
  { factor: "Key Communities", sobha: "Sobha Hartland, Reserve", meraas: "Bluewaters, La Mer", winner: "tie" },
  { factor: "Appreciation Potential", sobha: "22%", meraas: "20%", winner: "sobha" },
  { factor: "Rental Yield", sobha: "5.5%", meraas: "5.0%", winner: "sobha" },
  { factor: "Location Exclusivity", sobha: "High", meraas: "Ultra-High", winner: "meraas" },
  { factor: "Lifestyle Amenities", sobha: "Nature-Focused", meraas: "Entertainment-Focused", winner: "tie" },
  { factor: "Track Record (Years)", sobha: "25+", meraas: "14", winner: "sobha" },
  { factor: "Payment Plans", sobha: "60/40, 70/30", meraas: "60/40", winner: "sobha" },
];

export default function CompareSobhaVsMeraas() {
  useDocumentMeta({
    title: "Sobha vs Meraas | Luxury Developer Comparison Dubai 2025",
    description: "Compare Sobha and Meraas luxury developers. Sobha offers from AED 1.4M in nature-focused communities. Meraas delivers iconic waterfront from AED 1.8M.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "Sobha vs Meraas" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Luxury Comparison
                </Badge>
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-200 border-violet-400/30">
                  Premium Developers
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Sobha vs Meraas: Luxury Developer Battle
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mb-6 max-w-3xl">
                Two of Dubai's most prestigious luxury developers offer distinct propositions. 
                Sobha delivers nature-integrated elegance from AED 1.4M. Meraas creates iconic 
                waterfront destinations from AED 1.8M. Compare for your luxury investment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-sobha">
                  <Button size="lg" data-testid="button-explore-sobha">
                    Sobha Projects
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/off-plan-meraas">
                  <Button size="lg" variant="outline" data-testid="button-explore-meraas">
                    Meraas Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-purple-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  Sobha Realty
                </CardTitle>
                <p className="text-sm text-muted-foreground">Nature-integrated luxury living</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-purple-500/10">
                    <div className="text-xl font-bold text-purple-600">AED 1.4M</div>
                    <div className="text-xs text-muted-foreground">1-BR Entry</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-purple-500/10">
                    <div className="text-xl font-bold text-purple-600">5.5%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-purple-500/10">
                    <div className="text-xl font-bold text-purple-600">22%</div>
                    <div className="text-xs text-muted-foreground">Appreciation</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-purple-500/10">
                    <div className="text-xl font-bold text-purple-600">25+</div>
                    <div className="text-xs text-muted-foreground">Years Experience</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Sobha Hartland, Sobha Reserve communities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    In-house construction ensures quality
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Green parks and lagoon integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5 text-indigo-600" />
                  Meraas
                </CardTitle>
                <p className="text-sm text-muted-foreground">Iconic waterfront destinations</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-indigo-500/10">
                    <div className="text-xl font-bold text-indigo-600">AED 1.8M</div>
                    <div className="text-xs text-muted-foreground">1-BR Entry</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-indigo-500/10">
                    <div className="text-xl font-bold text-indigo-600">5.0%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-indigo-500/10">
                    <div className="text-xl font-bold text-indigo-600">20%</div>
                    <div className="text-xs text-muted-foreground">Appreciation</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-indigo-500/10">
                    <div className="text-xl font-bold text-indigo-600">Iconic</div>
                    <div className="text-xs text-muted-foreground">Locations</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Bluewaters, La Mer, City Walk
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Ain Dubai views and beachfront living
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Lifestyle and entertainment focus
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
                    <th className="text-left py-3 px-4 font-semibold bg-purple-500/5">Sobha</th>
                    <th className="text-left py-3 px-4 font-semibold bg-indigo-500/5">Meraas</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'sobha' ? 'bg-green-500/10' : 'bg-purple-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'sobha' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.sobha}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'meraas' ? 'bg-green-500/10' : 'bg-indigo-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'meraas' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.meraas}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'sobha' ? 'default' : row.winner === 'meraas' ? 'secondary' : 'outline'}>
                          {row.winner === 'sobha' ? 'Sobha' : row.winner === 'meraas' ? 'Meraas' : 'Tie'}
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
            <Card className="border-purple-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Sobha If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want nature-integrated luxury
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize long-term value growth
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Seek family-friendly communities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Value in-house quality control
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Meraas If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want iconic waterfront address
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize lifestyle amenities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Seek exclusive addresses
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Target luxury short-term rental
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Explore Luxury Developer Projects"
          subtitle="Connect with luxury property specialists who can guide you through Sobha and Meraas portfolios."
          ctaText="Get Expert Guidance"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Developer Guides"
          links={[
            { href: "/off-plan-sobha", title: "Sobha Properties" },
            { href: "/off-plan-meraas", title: "Meraas Properties" },
            { href: "/compare-emaar-vs-damac", title: "Emaar vs DAMAC" },
            { href: "/off-plan-emaar", title: "Emaar Projects" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
