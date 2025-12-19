import { Link } from "wouter";
import { TrendingUp, ChevronRight, Calculator, MapPin, Building, DollarSign, Home, BarChart3 } from "lucide-react";
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

const yieldsByArea = [
  { area: "Dubai South", yield: "8.5%", avgPrice: "AED 380K", trend: "up" },
  { area: "Jumeirah Village Circle", yield: "7.7%", avgPrice: "AED 420K", trend: "up" },
  { area: "Business Bay", yield: "7.2%", avgPrice: "AED 1.1M", trend: "stable" },
  { area: "Dubai Marina", yield: "6.2%", avgPrice: "AED 1.5M", trend: "stable" },
  { area: "Downtown Dubai", yield: "5.5%", avgPrice: "AED 1.8M", trend: "stable" },
  { area: "Palm Jumeirah", yield: "5.0%", avgPrice: "AED 3.5M", trend: "down" },
];

const roiComponents = [
  {
    title: "Capital Appreciation",
    description: "Property value increase from purchase to sale",
    typical: "15-30%",
    timeframe: "3-5 years"
  },
  {
    title: "Rental Income",
    description: "Annual rent as percentage of property value",
    typical: "5-9%",
    timeframe: "Annual"
  },
  {
    title: "Tax Savings",
    description: "No income tax, capital gains tax, or property tax",
    typical: "15-30%",
    timeframe: "vs home country"
  }
];

export default function PillarROIRentalYields() {
  useDocumentMeta({
    title: "Dubai ROI & Rental Yields Guide 2025 | Off-Plan Returns Analysis",
    description: "Complete guide to Dubai property ROI and rental yields. Compare yields by area from 5-9%. Learn how to calculate returns on off-plan investments. Updated 2025 data.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "ROI & Rental Yields Guide" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Tier 2 Pillar
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  2025 Data
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Dubai ROI & Rental Yields: Complete Investment Returns Guide
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-6 max-w-3xl">
                Understand how to calculate and maximize returns on Dubai off-plan property. 
                Compare rental yields by area (5-9%), learn ROI calculation methods, and 
                discover why Dubai's tax-free status amplifies your net returns.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/tools-roi-calculator">
                  <Button size="lg" data-testid="button-roi-calculator">
                    <Calculator className="mr-2 h-4 w-4" />
                    ROI Calculator
                  </Button>
                </Link>
                <Link href="/dubai-off-plan-investment-guide">
                  <Button size="lg" variant="outline" data-testid="button-investment-guide">
                    Investment Guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Understanding Dubai Property Returns</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {roiComponents.map((component, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">{component.typical}</div>
                  <h3 className="font-semibold mb-2">{component.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{component.description}</p>
                  <Badge variant="outline">{component.timeframe}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Rental Yields by Area (2025)</h2>
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Area</th>
                    <th className="text-center py-3 px-4 font-semibold">Gross Yield</th>
                    <th className="text-center py-3 px-4 font-semibold">Avg Entry Price</th>
                    <th className="text-center py-3 px-4 font-semibold">Trend</th>
                    <th className="text-center py-3 px-4 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {yieldsByArea.map((area, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{area.area}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-green-600">{area.yield}</span>
                      </td>
                      <td className="py-3 px-4 text-center">{area.avgPrice}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={area.trend === 'up' ? 'default' : area.trend === 'down' ? 'secondary' : 'outline'}>
                          {area.trend === 'up' ? 'Rising' : area.trend === 'down' ? 'Cooling' : 'Stable'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center text-muted-foreground text-xs">
                        {parseFloat(area.yield) >= 7.5 ? 'High Yield' : parseFloat(area.yield) >= 6 ? 'Balanced' : 'Appreciation'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Data from PropertyFinder.ae and Dubai Land Department, December 2025. Gross yields before service charges.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">ROI Calculation Methods</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simple ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-md mb-4 font-mono text-sm">
                  ROI = (Total Return / Investment) x 100
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Example:</strong></p>
                  <p>Purchase: AED 500,000 with 10% down (AED 50,000)</p>
                  <p>Capital Gain: AED 125,000 (25%)</p>
                  <p>ROI = (125,000 / 50,000) x 100 = <strong className="text-green-600">250%</strong></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cash-on-Cash Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-md mb-4 font-mono text-sm">
                  CoC = (Annual Cash Flow / Cash Invested) x 100
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Example:</strong></p>
                  <p>Investment: AED 50,000 down payment</p>
                  <p>Annual Rent: AED 45,000</p>
                  <p>CoC = (45,000 / 50,000) x 100 = <strong className="text-green-600">90%</strong></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Dubai Yields Outperform</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">No Income Tax</h3>
                <p className="text-sm text-muted-foreground">100% of rental income retained</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">No Capital Gains Tax</h3>
                <p className="text-sm text-muted-foreground">Full profit on property sale</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Home className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">No Property Tax</h3>
                <p className="text-sm text-muted-foreground">Only service charges</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">High Demand</h3>
                <p className="text-sm text-muted-foreground">Strong expat rental market</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Maximizing Your Returns</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">For Highest Rental Yield</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                      Choose Dubai South, JVC, or Dubai Silicon Oasis
                    </li>
                    <li className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-primary mt-1 shrink-0" />
                      Focus on studios and 1-BR (highest yield per sqft)
                    </li>
                    <li className="flex items-start gap-2">
                      <Calculator className="h-4 w-4 text-primary mt-1 shrink-0" />
                      Target properties under AED 600K
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">For Maximum Capital Growth</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                      Choose Dubai Hills, Creek Harbour, or new master plans
                    </li>
                    <li className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-primary mt-1 shrink-0" />
                      Buy early-stage off-plan projects
                    </li>
                    <li className="flex items-start gap-2">
                      <Calculator className="h-4 w-4 text-primary mt-1 shrink-0" />
                      Focus on Emaar and Meraas for premium appreciation
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Calculate Your Expected Returns"
          subtitle="Use our free ROI calculator or connect with investment consultants for personalized return projections."
          ctaText="Get ROI Analysis"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Investment Resources"
          links={[
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/compare-jvc-vs-dubai-south", title: "High Yield Areas" },
            { href: "/off-plan-jvc", title: "JVC Properties" },
            { href: "/off-plan-golden-visa", title: "Golden Visa" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
