import { Building, Check, Minus, Bed, ChevronRight } from "lucide-react";
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

export default function CompareStudioVs1Bed() {
  useDocumentMeta({
    title: "Studio vs 1-Bedroom Dubai | Investment Comparison 2026",
    description: "Compare studio apartments vs 1-bedroom units in Dubai. Which offers better ROI, rental yields, and capital appreciation? Data-driven investment analysis.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Comparisons", href: "/dubai-off-plan-properties" },
    { label: "Studio vs 1-Bedroom" }
  ];

  const comparisonData = [
    { feature: "Typical Size (sq ft)", option1: "350-500", option2: "650-900", winner: "tie" as const },
    { feature: "Entry Price", option1: "AED 400K-600K", option2: "AED 700K-1.2M", winner: "option1" as const },
    { feature: "Average ROI", option1: "8-12%", option2: "7-10%", winner: "option1" as const },
    { feature: "Rental Yield", option1: "7-9%", option2: "6-8%", winner: "option1" as const },
    { feature: "Target Tenants", option1: "Singles, Students", option2: "Couples, Young Pros", winner: "tie" as const },
    { feature: "Vacancy Rate", option1: "Moderate", option2: "Lower", winner: "option2" as const },
    { feature: "Capital Appreciation", option1: "Moderate", option2: "Higher", winner: "option2" as const },
    { feature: "Resale Demand", option1: "High", option2: "Higher", winner: "option2" as const },
    { feature: "Service Charges", option1: "Lower", option2: "Higher", winner: "option1" as const },
    { feature: "Lifestyle Appeal", option1: "Basic", option2: "Better", winner: "option2" as const }
  ];

  const studioAdvantages = [
    "Lower entry point - ideal for first-time investors",
    "Higher rental yields (7-9% average)",
    "Easier to manage and maintain",
    "Lower service charges per unit",
    "Quick to rent - high demand from singles",
    "Lower risk per investment"
  ];

  const oneBedAdvantages = [
    "Better capital appreciation potential",
    "Lower vacancy rates - couples prefer stability",
    "Stronger resale market demand",
    "More versatile - suits wider tenant base",
    "Higher absolute rental income",
    "Better lifestyle amenities typically included"
  ];

  const topStudioAreas = [
    { area: "JVC", price: "AED 450K", yield: "8.5%", units: "High Supply" },
    { area: "Dubai Sports City", price: "AED 400K", yield: "9%", units: "Good Supply" },
    { area: "Dubai Silicon Oasis", price: "AED 420K", yield: "8%", units: "Moderate" },
    { area: "International City", price: "AED 280K", yield: "10%", units: "High" },
    { area: "Business Bay", price: "AED 600K", yield: "7%", units: "Moderate" }
  ];

  const topOneBedAreas = [
    { area: "Dubai Marina", price: "AED 1.2M", yield: "6.5%", units: "Good Supply" },
    { area: "Downtown Dubai", price: "AED 1.5M", yield: "5.5%", units: "Limited" },
    { area: "JVC", price: "AED 750K", yield: "7%", units: "High Supply" },
    { area: "Business Bay", price: "AED 950K", yield: "6.5%", units: "Good" },
    { area: "Dubai Creek Harbour", price: "AED 1.1M", yield: "6%", units: "Moderate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-200 border-violet-400/30">
                  <Bed className="h-3 w-3 mr-1" />
                  Investment Guide
                </Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                  2026 Analysis
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Studio vs 1-Bedroom: Dubai Investment Comparison
              </h1>
              <p className="text-lg md:text-xl text-violet-100 mb-6 max-w-3xl">
                Compare studio apartments with 1-bedroom units for Dubai property investment. 
                Discover which property type delivers better returns based on your investment 
                goals, budget, and risk tolerance.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <Card className="border-amber-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <Building className="h-5 w-5" />
                Studio Apartments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Compact units (350-500 sq ft) ideal for budget-conscious investors seeking 
                high rental yields and lower entry costs.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-muted/30 rounded-md text-center">
                  <p className="text-2xl font-bold text-amber-600">8-9%</p>
                  <p className="text-xs text-muted-foreground">Avg Yield</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md text-center">
                  <p className="text-2xl font-bold">AED 400K+</p>
                  <p className="text-xs text-muted-foreground">Starting Price</p>
                </div>
              </div>
              <ul className="space-y-2">
                {studioAdvantages.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Bed className="h-5 w-5" />
                1-Bedroom Apartments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Larger units (650-900 sq ft) offering better appreciation potential 
                and lower vacancy rates for long-term investors.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-muted/30 rounded-md text-center">
                  <p className="text-2xl font-bold text-blue-600">6-7%</p>
                  <p className="text-xs text-muted-foreground">Avg Yield</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md text-center">
                  <p className="text-2xl font-bold">AED 700K+</p>
                  <p className="text-xs text-muted-foreground">Starting Price</p>
                </div>
              </div>
              <ul className="space-y-2">
                {oneBedAdvantages.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Side-by-Side Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Feature</th>
                    <th className="text-left py-3">Studio</th>
                    <th className="text-left py-3">1-Bedroom</th>
                    <th className="text-left py-3">Advantage</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 font-medium">{row.feature}</td>
                      <td className={`py-3 ${row.winner === 'option1' ? 'text-amber-600 font-semibold' : ''}`}>{row.option1}</td>
                      <td className={`py-3 ${row.winner === 'option2' ? 'text-blue-600 font-semibold' : ''}`}>{row.option2}</td>
                      <td className="py-3">
                        {row.winner === 'option1' && <Badge variant="outline" className="text-amber-600 border-amber-300">Studio</Badge>}
                        {row.winner === 'option2' && <Badge variant="outline" className="text-blue-600 border-blue-300">1-Bed</Badge>}
                        {row.winner === 'tie' && <Minus className="h-4 w-4 text-muted-foreground" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Areas for Studios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Area</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Yield</th>
                      <th className="text-left py-2">Supply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStudioAreas.map((item, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2 font-medium">{item.area}</td>
                        <td className="py-2">{item.price}</td>
                        <td className="py-2 text-amber-600">{item.yield}</td>
                        <td className="py-2 text-muted-foreground">{item.units}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Areas for 1-Bedrooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Area</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Yield</th>
                      <th className="text-left py-2">Supply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topOneBedAreas.map((item, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2 font-medium">{item.area}</td>
                        <td className="py-2">{item.price}</td>
                        <td className="py-2 text-blue-600">{item.yield}</td>
                        <td className="py-2 text-muted-foreground">{item.units}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Investment Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-amber-500/10 rounded-md">
              <h4 className="font-semibold mb-2">Choose Studio If:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  Budget under AED 600K
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  Prioritizing rental yield over appreciation
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  First-time investor wanting lower risk
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  Planning to hold short-term (1-3 years)
                </li>
              </ul>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-md">
              <h4 className="font-semibold mb-2">Choose 1-Bedroom If:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  Budget AED 700K or above
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  Seeking better capital appreciation
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  Want lower vacancy and tenant turnover
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  Planning to hold long-term (5+ years)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <OffPlanCTASection
          title="Find the Right Property Type for Your Goals"
          subtitle="Connect with advisors who can match you with studio or 1-bed investments based on your budget and objectives."
          ctaText="Get Property Recommendations"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Comparisons"
          links={[
            { href: "/compare-villa-vs-apartment", title: "Villa vs Apartment" },
            { href: "/compare-off-plan-vs-ready", title: "Off-Plan vs Ready" },
            { href: "/compare-jvc-vs-dubai-south", title: "JVC vs Dubai South" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/tools-rental-yield-calculator", title: "Rental Yield Calculator" },
            { href: "/dubai-roi-rental-yields", title: "Rental Yields Guide" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
