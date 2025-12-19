import { Landmark, Building, Calendar, DollarSign, Target, Check, TrendingUp } from "lucide-react";
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

export default function CaseStudyRetirementPlanning() {
  useDocumentMeta({
    title: "Retirement Planning Case Study | Dubai Property Investment",
    description: "How a 55-year-old professional built a retirement income strategy with Dubai property. Tax-free rental income and Golden Visa residency benefits.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Case Studies", href: "/dubai-off-plan-properties" },
    { label: "Retirement Planning" }
  ];

  const portfolioDetails = [
    { property: "3-Bed Apartment - Dubai Marina", price: "AED 2,800,000", rental: "AED 180,000/yr", yield: "6.4%" },
    { property: "2-Bed Apartment - JBR", price: "AED 2,200,000", rental: "AED 150,000/yr", yield: "6.8%" }
  ];

  const benefits = [
    { title: "Tax-Free Income", description: "No income tax on rental earnings in UAE, maximizing retirement income" },
    { title: "Golden Visa", description: "10-year UAE residency with AED 2M+ investment, including spouse sponsorship" },
    { title: "Currency Stability", description: "AED pegged to USD provides currency stability vs home country inflation" },
    { title: "Healthcare Access", description: "UAE residency enables access to quality private healthcare options" },
    { title: "Lifestyle Option", description: "Possibility to spend winters in Dubai, rent out during summer months" },
    { title: "Estate Planning", description: "Properties can be passed to heirs with proper DIFC will registration" }
  ];

  const timeline = [
    { year: "2022", event: "Planning Phase", description: "Analyzed retirement income needs, compared UAE vs European property options" },
    { year: "2023", event: "First Purchase", description: "Acquired Dubai Marina 3-bed for AED 2.8M, secured Golden Visa" },
    { year: "2023", event: "Second Purchase", description: "Added JBR 2-bed for AED 2.2M, diversified beachfront exposure" },
    { year: "2024", event: "Rental Operations", description: "Both properties tenanted, generating AED 330K annual income" },
    { year: "2025", event: "Retirement Start", description: "Planned retirement with AED 27.5K monthly tax-free income" }
  ];

  const incomeBreakdown = [
    { source: "Dubai Marina Rental", monthly: "AED 15,000", annual: "AED 180,000" },
    { source: "JBR Rental", monthly: "AED 12,500", annual: "AED 150,000" },
    { source: "Total Gross", monthly: "AED 27,500", annual: "AED 330,000" },
    { source: "Less: Service Charges", monthly: "AED 3,000", annual: "AED 36,000" },
    { source: "Net Income", monthly: "AED 24,500", annual: "AED 294,000" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-teal-900 via-emerald-800 to-green-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-teal-500/20 text-teal-200 border-teal-400/30">
                  <Landmark className="h-3 w-3 mr-1" />
                  Case Study
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  Retirement Strategy
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Building Retirement Income in Dubai
              </h1>
              <p className="text-lg md:text-xl text-teal-100 mb-6 max-w-3xl">
                How a professional approaching retirement created a AED 294K annual 
                tax-free income stream through strategic Dubai property investment, 
                while securing Golden Visa residency benefits.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-teal-200">
                <span className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  2 Premium Properties
                </span>
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  AED 5M Invested
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  AED 294K Net Annual Income
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
                  55-year-old European professional, planning retirement in 3-5 years. 
                  Seeking to build passive income while maintaining flexibility.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Goals</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Generate reliable retirement income</li>
                  <li>Minimize tax on investment returns</li>
                  <li>Secure long-term residency option</li>
                  <li>Preserve capital for heirs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  Acquire 2 premium beachfront properties for stable rental demand, 
                  qualify for Golden Visa, create tax-free income stream.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">AED 5M</p>
              <p className="font-medium">Total Invested</p>
              <p className="text-xs text-muted-foreground">2 properties</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">AED 24.5K</p>
              <p className="font-medium">Monthly Net Income</p>
              <p className="text-xs text-muted-foreground">Tax-free</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">6.6%</p>
              <p className="font-medium">Blended Yield</p>
              <p className="text-xs text-muted-foreground">Gross rental</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-amber-600">10 Years</p>
              <p className="font-medium">Golden Visa</p>
              <p className="text-xs text-muted-foreground">UAE residency</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Portfolio Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Property</th>
                    <th className="text-left py-3">Purchase Price</th>
                    <th className="text-left py-3">Annual Rental</th>
                    <th className="text-left py-3">Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioDetails.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 font-medium">{item.property}</td>
                      <td className="py-3">{item.price}</td>
                      <td className="py-3">{item.rental}</td>
                      <td className="py-3 text-green-600">{item.yield}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Income Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Source</th>
                    <th className="text-right py-3">Monthly</th>
                    <th className="text-right py-3">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeBreakdown.map((item, index) => (
                    <tr key={index} className={`border-b last:border-0 ${item.source === 'Net Income' ? 'bg-muted/30 font-semibold' : ''}`}>
                      <td className="py-3">{item.source}</td>
                      <td className="py-3 text-right">{item.monthly}</td>
                      <td className="py-3 text-right">{item.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
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
                  <div className="w-16 shrink-0 text-sm font-semibold text-primary">{item.year}</div>
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
            <CardTitle>Key Benefits Achieved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">{benefit.title}</p>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <OffPlanCTASection
          title="Plan Your Retirement Income"
          subtitle="Connect with advisors who specialize in building retirement income strategies through Dubai property investment."
          ctaText="Get Retirement Planning Advice"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="More Case Studies"
          links={[
            { href: "/case-study-golden-visa", title: "Golden Visa Case Study" },
            { href: "/case-study-portfolio-diversification", title: "Portfolio Diversification" },
            { href: "/case-study-expat-family", title: "Expat Family Purchase" },
            { href: "/dubai-golden-visa", title: "Golden Visa Guide" },
            { href: "/tools-rental-yield-calculator", title: "Rental Yield Calculator" },
            { href: "/dubai-roi-rental-yields", title: "Rental Yields Guide" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
