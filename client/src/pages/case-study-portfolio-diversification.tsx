import { TrendingUp, Building, Calendar, DollarSign, Target, Check, BarChart3 } from "lucide-react";
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

export default function CaseStudyPortfolioDiversification() {
  useDocumentMeta({
    title: "Portfolio Diversification Case Study | Multi-Property Dubai Strategy",
    description: "How an investor built a diversified Dubai portfolio across 4 properties in different areas. Strategy for balancing risk and maximizing returns.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Case Studies", href: "/dubai-off-plan-properties" },
    { label: "Portfolio Diversification" }
  ];

  const portfolio = [
    { property: "Studio - JVC", developer: "Danube", price: "AED 520,000", yield: "8.5%", purpose: "Yield Focus" },
    { property: "1-Bed - Business Bay", developer: "DAMAC", price: "AED 950,000", yield: "6.5%", purpose: "Appreciation" },
    { property: "2-Bed - Dubai Hills", developer: "Emaar", price: "AED 1,800,000", yield: "5.5%", purpose: "Premium Asset" },
    { property: "Townhouse - DAMAC Hills 2", developer: "DAMAC", price: "AED 1,200,000", yield: "7%", purpose: "Family Rental" }
  ];

  const timeline = [
    { date: "Jan 2021", event: "Initial Analysis", description: "Researched Dubai market, identified 4 target segments for diversification" },
    { date: "Mar 2021", event: "First Purchase", description: "JVC studio - lowest entry point, highest yield, established rental market" },
    { date: "Aug 2021", event: "Second Purchase", description: "Business Bay 1-bed - capital appreciation focus, corporate tenant target" },
    { date: "Feb 2022", event: "Third Purchase", description: "Dubai Hills 2-bed - premium segment, Emaar quality, family appeal" },
    { date: "Sept 2022", event: "Fourth Purchase", description: "DAMAC Hills 2 townhouse - villa segment exposure without villa pricing" },
    { date: "Dec 2024", event: "Portfolio Review", description: "All properties performing above market average, combined value up 35%" }
  ];

  const results = [
    { metric: "Total Invested", value: "AED 4.47M", subtext: "Across 4 properties" },
    { metric: "Current Value", value: "AED 6.03M", subtext: "35% appreciation" },
    { metric: "Annual Rental", value: "AED 298K", subtext: "6.7% blended yield" },
    { metric: "Monthly Income", value: "AED 24,800", subtext: "Net after charges" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Case Study
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                  Multi-Property Strategy
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Building a Diversified Dubai Portfolio
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-6 max-w-3xl">
                How a strategic investor built a 4-property portfolio across different Dubai 
                segments, achieving 35% appreciation and AED 298K annual rental income while 
                minimizing risk through diversification.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-indigo-200">
                <span className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  4 Properties
                </span>
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  AED 4.47M Invested
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  35% Portfolio Growth
                </span>
              </div>
            </div>
          </div>
        </section>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Investor Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Background</h4>
                <p className="text-sm text-muted-foreground">
                  European investor with experience in home-country property, seeking to 
                  diversify internationally into a tax-efficient market with strong growth.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Goals</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Build passive income stream</li>
                  <li>Achieve capital appreciation</li>
                  <li>Minimize concentration risk</li>
                  <li>Mix yield and growth assets</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  Spread investment across 4 segments: affordable high-yield, mid-market 
                  appreciation, premium quality, and family villa market.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Portfolio Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Property</th>
                    <th className="text-left py-3">Developer</th>
                    <th className="text-left py-3">Purchase Price</th>
                    <th className="text-left py-3">Current Yield</th>
                    <th className="text-left py-3">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 font-medium">{item.property}</td>
                      <td className="py-3">{item.developer}</td>
                      <td className="py-3">{item.price}</td>
                      <td className="py-3 text-green-600">{item.yield}</td>
                      <td className="py-3">
                        <Badge variant="outline" className="text-xs">{item.purpose}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {results.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{item.value}</p>
                <p className="font-medium">{item.metric}</p>
                <p className="text-xs text-muted-foreground">{item.subtext}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Investment Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-20 shrink-0 text-sm text-muted-foreground">{item.date}</div>
                  <div className="flex-1 pb-4 border-b last:border-0">
                    <p className="font-semibold">{item.event}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Diversification Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Risk Mitigation</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Geographic spread across 4 Dubai areas
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Multiple developers (Emaar, DAMAC, Danube)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Different property types (studio to townhouse)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Various tenant profiles (singles, families, corporates)
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Return Optimization</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    High-yield assets for cash flow (JVC studio)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Growth assets for appreciation (Business Bay)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Premium assets for stability (Dubai Hills)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Alternative segment exposure (townhouse)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <OffPlanCTASection
          title="Build Your Diversified Portfolio"
          subtitle="Connect with advisors who can help you create a balanced property portfolio matching your investment goals."
          ctaText="Get Portfolio Advice"
          onCtaClick={() => window.open('https://thrivestate.io', '_blank')}
        />

        <RelatedLinks
          title="More Case Studies"
          links={[
            { href: "/case-study-investor-jvc", title: "JVC Investor Success" },
            { href: "/case-study-crypto-buyer", title: "Crypto Buyer Case Study" },
            { href: "/case-study-investor-flip", title: "Flip Strategy Success" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/dubai-roi-rental-yields", title: "Rental Yields Guide" },
            { href: "/dubai-off-plan-properties", title: "Off-Plan Hub" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
