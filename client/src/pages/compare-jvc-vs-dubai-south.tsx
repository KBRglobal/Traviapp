import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, MapPin, TrendingUp, Home, DollarSign, Building } from "lucide-react";
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
  { factor: "Studio Starting Price", jvc: "AED 420,000", dubaiSouth: "AED 380,000", winner: "dubaisouth" },
  { factor: "1-BR Starting Price", jvc: "AED 500,000", dubaiSouth: "AED 450,000", winner: "dubaisouth" },
  { factor: "Rental Yield", jvc: "7.5-8%", dubaiSouth: "8-9%", winner: "dubaisouth" },
  { factor: "Established Community", jvc: "Yes - Mature", dubaiSouth: "Developing", winner: "jvc" },
  { factor: "Metro Access", jvc: "Coming Soon", dubaiSouth: "Expo 2020 Metro", winner: "dubaisouth" },
  { factor: "Distance to Marina", jvc: "15 min", dubaiSouth: "35 min", winner: "jvc" },
  { factor: "Distance to Airport", jvc: "25 min (DXB)", dubaiSouth: "10 min (DWC)", winner: "dubaisouth" },
  { factor: "Active Projects", jvc: "195+", dubaiSouth: "85+", winner: "jvc" },
  { factor: "Capital Appreciation", jvc: "20-25%", dubaiSouth: "25-35%", winner: "dubaisouth" },
  { factor: "Lifestyle Amenities", jvc: "30+ parks, malls", dubaiSouth: "Growing", winner: "jvc" },
];

const jvcHighlights = [
  { title: "Entry Price", value: "AED 420K", description: "Lowest studio starting price" },
  { title: "Rental Yield", value: "7.7%", description: "Average for 1-BR" },
  { title: "Projects", value: "195+", description: "Active off-plan projects" },
  { title: "Community", value: "Mature", description: "Established since 2005" }
];

const dubaiSouthHighlights = [
  { title: "Entry Price", value: "AED 380K", description: "Lowest studio starting price" },
  { title: "Rental Yield", value: "8.5%", description: "Average for 1-BR" },
  { title: "Growth", value: "35%", description: "Projected appreciation" },
  { title: "Airport", value: "10 min", description: "To Al Maktoum (DWC)" }
];

export default function CompareJVCvsDubaiSouth() {
  useDocumentMeta({
    title: "JVC vs Dubai South | Best Value Off-Plan Investment 2026",
    description: "Compare JVC and Dubai South for off-plan investment. JVC offers mature community from AED 420K. Dubai South provides higher yields from AED 380K. Complete analysis.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "JVC vs Dubai South" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Location Comparison
                </Badge>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30">
                  Best Value 2026
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                JVC vs Dubai South: Best Value Investment 2026
              </h1>
              <p className="text-lg md:text-xl text-emerald-100 mb-6 max-w-3xl">
                Both JVC and Dubai South offer affordable entry points for Dubai property investment. 
                Compare rental yields, capital appreciation, lifestyle amenities, and investment 
                potential to find the best location for your budget.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-jvc">
                  <Button size="lg" data-testid="button-explore-jvc">
                    Explore JVC
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/off-plan-dubai-south">
                  <Button size="lg" variant="outline" data-testid="button-explore-dubai-south">
                    Explore Dubai South
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Stats Comparison</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Jumeirah Village Circle (JVC)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {jvcHighlights.map((item, index) => (
                    <div key={index} className="text-center p-3 rounded-md bg-emerald-500/10">
                      <div className="text-xl font-bold text-emerald-600">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.title}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-600" />
                  Dubai South
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {dubaiSouthHighlights.map((item, index) => (
                    <div key={index} className="text-center p-3 rounded-md bg-cyan-500/10">
                      <div className="text-xl font-bold text-cyan-600">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.title}</div>
                    </div>
                  ))}
                </div>
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
                    <th className="text-left py-3 px-4 font-semibold bg-emerald-500/5">JVC</th>
                    <th className="text-left py-3 px-4 font-semibold bg-cyan-500/5">Dubai South</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'jvc' ? 'bg-green-500/10' : 'bg-emerald-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'jvc' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.jvc}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'dubaisouth' ? 'bg-green-500/10' : 'bg-cyan-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'dubaisouth' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.dubaiSouth}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'jvc' ? 'default' : 'secondary'}>
                          {row.winner === 'jvc' ? 'JVC' : 'Dubai South'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Score: JVC wins 4 categories | Dubai South wins 6 categories
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Investment Recommendations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Home className="h-5 w-5 text-emerald-600" />
                  Choose JVC If You:
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want established community with amenities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer closer to Dubai Marina/JLT
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Need wider selection of projects
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Value proven rental demand
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Family-oriented with parks & schools
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="/off-plan-jvc">
                    <Button variant="outline" className="w-full" data-testid="button-view-jvc-projects">
                      View JVC Projects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-cyan-600" />
                  Choose Dubai South If You:
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want maximum appreciation potential
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer lowest entry prices
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Work near Al Maktoum Airport
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want highest rental yields
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Comfortable with developing area
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="/off-plan-dubai-south">
                    <Button variant="outline" className="w-full" data-testid="button-view-dubai-south-projects">
                      View Dubai South Projects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Price Comparison by Unit Type</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Unit Type</th>
                      <th className="text-center py-3 px-4">JVC Price</th>
                      <th className="text-center py-3 px-4">Dubai South Price</th>
                      <th className="text-center py-3 px-4">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Studio</td>
                      <td className="py-3 px-4 text-center">AED 420,000</td>
                      <td className="py-3 px-4 text-center">AED 380,000</td>
                      <td className="py-3 px-4 text-center text-green-600 font-semibold">AED 40,000 (9.5%)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">1-Bedroom</td>
                      <td className="py-3 px-4 text-center">AED 500,000</td>
                      <td className="py-3 px-4 text-center">AED 450,000</td>
                      <td className="py-3 px-4 text-center text-green-600 font-semibold">AED 50,000 (10%)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">2-Bedroom</td>
                      <td className="py-3 px-4 text-center">AED 840,000</td>
                      <td className="py-3 px-4 text-center">AED 720,000</td>
                      <td className="py-3 px-4 text-center text-green-600 font-semibold">AED 120,000 (14%)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Prices from PropertyFinder.ae as of December 2026. Actual prices vary by project and developer.
              </p>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Get Expert Location Advice"
          subtitle="Connect with consultants who can help you choose between JVC and Dubai South based on your investment goals and budget."
          ctaText="Get Location Guidance"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Location Guides"
          links={[
            { href: "/off-plan-jvc", title: "JVC Properties" },
            { href: "/off-plan-dubai-south", title: "Dubai South" },
            { href: "/off-plan-business-bay", title: "Business Bay" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/best-off-plan-projects-dubai-2026", title: "Best Projects 2026" },
            { href: "/off-plan-golden-visa", title: "Golden Visa" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
