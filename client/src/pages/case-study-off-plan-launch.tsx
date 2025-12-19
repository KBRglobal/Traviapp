import { Rocket, Building, DollarSign, Clock, Check, TrendingUp } from "lucide-react";
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

export default function CaseStudyOffPlanLaunch() {
  useDocumentMeta({
    title: "Off-Plan Launch Day Success | Early Buyer Case Study",
    description: "How buying at launch day secured 18% below current market value. Step-by-step case study of an Emaar project launch investment.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Case Studies", href: "/dubai-off-plan-properties" },
    { label: "Off-Plan Launch Success" }
  ];

  const launchProcess = [
    { step: 1, title: "Priority Registration", description: "Registered with broker 2 weeks before public launch for priority access" },
    { step: 2, title: "Unit Selection", description: "Reviewed floor plans and selected optimal unit (high floor, park view)" },
    { step: 3, title: "Launch Day Booking", description: "Arrived early, secured chosen unit with 10% booking deposit" },
    { step: 4, title: "SPA Signing", description: "Signed Sale & Purchase Agreement within 14 days as per Emaar terms" },
    { step: 5, title: "Oqood Registration", description: "Property registered with DLD, received Oqood certificate" },
    { step: 6, title: "Payment Milestones", description: "Following 60/40 plan - 60% during construction, 40% on handover" }
  ];

  const priceComparison = [
    { stage: "Launch Day Price", price: "AED 1,850,000", timing: "March 2023" },
    { stage: "Price After 3 Months", price: "AED 2,100,000", timing: "June 2023" },
    { stage: "Current Resale Price", price: "AED 2,180,000", timing: "Dec 2024" },
    { stage: "Projected Handover Value", price: "AED 2,400,000", timing: "Q4 2025" }
  ];

  const investorTips = [
    "Build relationships with reputable brokers for early access",
    "Research developer track record before launch day",
    "Have EOI (Expression of Interest) funds ready in advance",
    "Study floor plans and identify best units before the crowd",
    "Understand payment plan and have financing arranged",
    "Act decisively - premium units sell within hours"
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                  <Rocket className="h-3 w-3 mr-1" />
                  Case Study
                </Badge>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  Launch Day Strategy
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Securing Launch Day Advantage
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mb-6 max-w-3xl">
                How strategic preparation and early access at an Emaar launch secured a 
                2-bedroom apartment 18% below current market value, with projected 30% 
                total return by handover.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-orange-200">
                <span className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Emaar Creek Waters
                </span>
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  AED 1.85M Launch Price
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  18% Below Current Market
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">AED 1.85M</p>
              <p className="font-medium">Launch Price</p>
              <p className="text-xs text-muted-foreground">March 2023</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">AED 330K</p>
              <p className="font-medium">Equity Gained</p>
              <p className="text-xs text-muted-foreground">Paper profit to date</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">30%</p>
              <p className="font-medium">Projected ROI</p>
              <p className="text-xs text-muted-foreground">By handover Q4 2025</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Price Evolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Stage</th>
                    <th className="text-left py-3">Price</th>
                    <th className="text-left py-3">Timing</th>
                    <th className="text-left py-3">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {priceComparison.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 font-medium">{item.stage}</td>
                      <td className="py-3">{item.price}</td>
                      <td className="py-3 text-muted-foreground">{item.timing}</td>
                      <td className="py-3">
                        {index === 0 ? (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-600">Base Price</Badge>
                        ) : (
                          <span className="text-green-600">
                            +{((parseInt(item.price.replace(/[^0-9]/g, '')) - 1850000) / 1850000 * 100).toFixed(0)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Launch Day Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {launchProcess.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{item.step}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Launch Day Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-muted/30 rounded-md">
                <h4 className="font-semibold mb-2 text-orange-600">Best Prices</h4>
                <p className="text-sm text-muted-foreground">
                  Developers offer launch-day pricing 10-20% below subsequent phases. 
                  Early buyers get the biggest discount.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-md">
                <h4 className="font-semibold mb-2 text-orange-600">Best Units</h4>
                <p className="text-sm text-muted-foreground">
                  Premium units (high floors, corner apartments, best views) sell 
                  first. Late buyers get leftover inventory.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-md">
                <h4 className="font-semibold mb-2 text-orange-600">Best Terms</h4>
                <p className="text-sm text-muted-foreground">
                  Launch promotions often include DLD fee waivers, flexible payment 
                  plans, and broker incentives passed to buyers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Launch Day Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-3">
              {investorTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <OffPlanCTASection
          title="Get Priority Access to Launches"
          subtitle="Connect with advisors who provide early access to upcoming project launches from top developers."
          ctaText="Get Launch Access"
          onCtaClick={() => window.open('https://thrivestate.io', '_blank')}
        />

        <RelatedLinks
          title="More Case Studies"
          links={[
            { href: "/case-study-investor-jvc", title: "JVC Investor Success" },
            { href: "/case-study-portfolio-diversification", title: "Portfolio Diversification" },
            { href: "/case-study-crypto-buyer", title: "Crypto Buyer Case Study" },
            { href: "/dubai-off-plan-emaar", title: "Emaar Guide" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/dubai-off-plan-properties", title: "Off-Plan Hub" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
