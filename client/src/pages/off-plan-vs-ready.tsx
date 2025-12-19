import { Link } from "wouter";
import { Scale, ChevronRight, Clock, TrendingUp, Home, CheckCircle, X, Building, Key } from "lucide-react";
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

const comparisonData = [
  { 
    aspect: "Entry Price", 
    offPlan: "10-30% below market", 
    ready: "Current market price",
    winner: "offplan"
  },
  { 
    aspect: "Payment Terms", 
    offPlan: "Flexible 60/40, 70/30 plans", 
    ready: "Full payment or mortgage",
    winner: "offplan"
  },
  { 
    aspect: "Immediate Use", 
    offPlan: "Wait 2-4 years for handover", 
    ready: "Move in or rent immediately",
    winner: "ready"
  },
  { 
    aspect: "Capital Appreciation", 
    offPlan: "Higher potential (20-30%)", 
    ready: "Moderate (5-10% annually)",
    winner: "offplan"
  },
  { 
    aspect: "Rental Income", 
    offPlan: "Starts after handover", 
    ready: "Immediate rental yield",
    winner: "ready"
  },
  { 
    aspect: "Property Inspection", 
    offPlan: "Based on plans/renders", 
    ready: "Physical inspection possible",
    winner: "ready"
  },
  { 
    aspect: "Unit Selection", 
    offPlan: "Best floors/views available", 
    ready: "Limited to available units",
    winner: "offplan"
  },
  { 
    aspect: "Developer Risk", 
    offPlan: "Project delay/cancellation risk", 
    ready: "No construction risk",
    winner: "ready"
  }
];

const offPlanPros = [
  "Lower entry prices (10-30% below completion value)",
  "Flexible payment plans spread over construction",
  "First choice of best units, floors, and views",
  "Highest capital appreciation potential",
  "Modern designs and latest specifications",
  "Post-handover payment options available"
];

const offPlanCons = [
  "2-4 year wait for property handover",
  "Risk of project delays or changes",
  "Cannot inspect actual finished unit",
  "No immediate rental income"
];

const readyPros = [
  "Immediate possession and use",
  "Instant rental income generation",
  "Physical inspection before purchase",
  "No construction or delay risk",
  "Established community and amenities",
  "Easier mortgage approval"
];

const readyCons = [
  "Higher entry price at current market rates",
  "Full payment or mortgage required upfront",
  "Limited unit selection",
  "Lower capital appreciation potential"
];

export default function OffPlanVsReady() {
  useDocumentMeta({
    title: "Off-Plan vs Ready Property Dubai | Complete Comparison Guide 2025",
    description: "Compare Dubai off-plan vs ready properties. Off-plan offers 10-30% lower prices and flexible payments. Ready provides immediate use. Find which investment strategy suits you.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Investment Guide", href: "/dubai-off-plan-investment-guide" },
    { label: "Off-Plan vs Ready" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-vs-ready" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-200 border-violet-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Comparison Guide
                </Badge>
                <Badge variant="secondary" className="bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30">
                  Investment Analysis
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Off-Plan vs Ready Properties
              </h1>
              <p className="text-lg md:text-xl text-violet-100 mb-6 max-w-3xl">
                Should you invest in off-plan or ready property in Dubai? This comprehensive 
                comparison helps you understand the trade-offs between lower prices and flexibility 
                (off-plan) versus immediate use and certainty (ready).
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-off-plan">
                  Explore Off-Plan
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/dubai-off-plan-investment-guide">
                  <Button size="lg" variant="outline" data-testid="button-investment-guide">
                    Investment Guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mb-12">
          <Card className="border-primary">
            <CardContent className="pt-6 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">Off-Plan</div>
              <div className="text-sm text-muted-foreground">Buy before completion</div>
              <div className="mt-4 text-lg font-semibold text-primary">10-30% Lower Prices</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Key className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">Ready</div>
              <div className="text-sm text-muted-foreground">Move in immediately</div>
              <div className="mt-4 text-lg font-semibold">Immediate Possession</div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Side-by-Side Comparison</h2>
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Aspect</th>
                    <th className="text-left py-3 px-4 bg-primary/5">Off-Plan</th>
                    <th className="text-left py-3 px-4">Ready</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">{row.aspect}</td>
                      <td className={`py-3 px-4 ${row.winner === 'offplan' ? 'bg-green-500/10' : 'bg-primary/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'offplan' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {row.offPlan}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'ready' ? 'bg-green-500/10' : ''}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'ready' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {row.ready}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Off-Plan Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold text-green-600 mb-2">Advantages</h4>
                  <ul className="space-y-2">
                    {offPlanPros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Considerations</h4>
                  <ul className="space-y-2">
                    {offPlanCons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Ready Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold text-green-600 mb-2">Advantages</h4>
                  <ul className="space-y-2">
                    {readyPros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Considerations</h4>
                  <ul className="space-y-2">
                    {readyCons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Who Should Choose What?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Off-Plan If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have 2-4 years before needing the property
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want to maximize capital appreciation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer flexible payment plans over mortgages
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want first choice of best units and views
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Comfortable with construction period risk
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Ready If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Need to move in or rent immediately
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want to inspect the actual property before buying
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer certainty over potential upside
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have financing ready or mortgage approval
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want established community and amenities
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Investment Returns Comparison
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Off-Plan (3-Year Hold)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Purchase Price:</span>
                      <span className="font-semibold">AED 1,000,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Value at Handover:</span>
                      <span className="font-semibold">AED 1,250,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span>Capital Gain:</span>
                      <span className="font-semibold text-green-600">25%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Ready Property (3-Year Hold)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Purchase Price:</span>
                      <span className="font-semibold">AED 1,250,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Value After 3 Years:</span>
                      <span className="font-semibold">AED 1,400,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Plus Rental Income:</span>
                      <span className="font-semibold">AED 270,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span>Total Return:</span>
                      <span className="font-semibold text-green-600">33%</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Note: Returns are illustrative and depend on market conditions, location, and property type.
              </p>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Get Personalized Investment Advice"
          subtitle="Connect with consultants who can analyze your situation and recommend the best investment approach - off-plan, ready, or a mix of both."
          ctaText="Get Expert Advice"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Investment Guides"
          links={[
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans" },
            { href: "/off-plan-post-handover", title: "Post-Handover Plans" },
            { href: "/best-off-plan-projects-dubai-2025", title: "Best Projects 2025" },
            { href: "/how-to-buy-dubai-off-plan", title: "How to Buy" },
            { href: "/off-plan-golden-visa", title: "Golden Visa" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
