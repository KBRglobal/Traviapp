import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, Calendar, DollarSign, PiggyBank, TrendingUp } from "lucide-react";
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
  { factor: "Monthly Payment (AED 1M)", plan60: "AED 16,667", plan80: "AED 22,222", winner: "60-40" },
  { factor: "At Handover (AED 1M)", plan60: "AED 400,000", plan80: "AED 200,000", winner: "80-20" },
  { factor: "Cash Flow During Build", plan60: "Better", plan80: "Tighter", winner: "60-40" },
  { factor: "Handover Pressure", plan60: "Higher", plan80: "Lower", winner: "80-20" },
  { factor: "Mortgage Eligibility", plan60: "Easier", plan80: "Harder", winner: "60-40" },
  { factor: "Total Interest Saved", plan60: "Less", plan80: "More", winner: "80-20" },
  { factor: "Developer Availability", plan60: "Most Common", plan80: "Less Common", winner: "60-40" },
  { factor: "Flip Before Handover", plan60: "More Equity", plan80: "Less Equity", winner: "80-20" },
];

export default function Compare6040vs8020() {
  useDocumentMeta({
    title: "60/40 vs 80/20 Payment Plans | Dubai Off-Plan Comparison 2025",
    description: "Compare 60/40 and 80/20 Dubai off-plan payment plans. 60/40 has lower monthly payments, 80/20 reduces handover burden. Find your ideal plan.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "60/40 vs 80/20" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-teal-900 via-cyan-800 to-emerald-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-teal-500/20 text-teal-200 border-teal-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Payment Comparison
                </Badge>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30">
                  Cash Flow Analysis
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                60/40 vs 80/20 Payment Plans: Which Suits You?
              </h1>
              <p className="text-lg md:text-xl text-teal-100 mb-6 max-w-3xl">
                The two most common Dubai off-plan payment structures offer different 
                advantages. 60/40 eases monthly cash flow while 80/20 reduces the handover 
                burden. Compare to find your ideal payment structure.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/tools-payment-calculator">
                  <Button size="lg" data-testid="button-calculate">
                    Calculate Payments
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dubai-off-plan-payment-plans">
                  <Button size="lg" variant="outline" data-testid="button-all-plans">
                    All Payment Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-teal-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-teal-600" />
                  60/40 Payment Plan
                </CardTitle>
                <p className="text-sm text-muted-foreground">Lower monthly payments, higher handover</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-teal-500/10">
                    <div className="text-xl font-bold text-teal-600">60%</div>
                    <div className="text-xs text-muted-foreground">During Construction</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-teal-500/10">
                    <div className="text-xl font-bold text-teal-600">40%</div>
                    <div className="text-xs text-muted-foreground">At Handover</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Example: AED 1M property = AED 16,667/month for 36 months + AED 400,000 at handover
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    More comfortable monthly payments
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Most commonly offered by developers
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Easier mortgage qualification at handover
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-600" />
                  80/20 Payment Plan
                </CardTitle>
                <p className="text-sm text-muted-foreground">Higher monthly payments, lower handover</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-cyan-500/10">
                    <div className="text-xl font-bold text-cyan-600">80%</div>
                    <div className="text-xs text-muted-foreground">During Construction</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-cyan-500/10">
                    <div className="text-xl font-bold text-cyan-600">20%</div>
                    <div className="text-xs text-muted-foreground">At Handover</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Example: AED 1M property = AED 22,222/month for 36 months + AED 200,000 at handover
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Lower handover payment pressure
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    More equity if flipping before handover
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Less financing needed at completion
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
                    <th className="text-left py-3 px-4 font-semibold bg-teal-500/5">60/40 Plan</th>
                    <th className="text-left py-3 px-4 font-semibold bg-cyan-500/5">80/20 Plan</th>
                    <th className="text-center py-3 px-4 font-semibold">Better For</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === '60-40' ? 'bg-green-500/10' : 'bg-teal-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === '60-40' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.plan60}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === '80-20' ? 'bg-green-500/10' : 'bg-cyan-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === '80-20' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.plan80}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === '60-40' ? 'default' : 'secondary'}>
                          {row.winner === '60-40' ? '60/40' : '80/20'}
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
          <h2 className="text-2xl font-bold mb-6">Best Choice By Investor Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-teal-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose 60/40 If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want lower monthly payments during construction
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Plan to get a mortgage at handover
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have savings growing for handover payment
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want maximum project options
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose 80/20 If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want to minimize handover payment stress
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have strong current cash flow
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Might flip before handover
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want to avoid mortgage interest
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Calculate Your Payment Options"
          subtitle="Use our free calculator or connect with consultants to find projects with your ideal payment structure."
          ctaText="Get Payment Plan Help"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Payment Resources"
          links={[
            { href: "/tools-payment-calculator", title: "Payment Calculator" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans Guide" },
            { href: "/off-plan-post-handover", title: "Post-Handover Plans" },
            { href: "/compare-off-plan-vs-ready", title: "Off-Plan vs Ready" },
            { href: "/tools-affordability-calculator", title: "Affordability Calculator" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
