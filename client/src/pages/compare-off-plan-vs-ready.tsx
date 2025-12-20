import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, X, Building, Key, TrendingUp, Clock, Calculator, Home } from "lucide-react";
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
  { factor: "Entry Price", offPlan: "10-30% below market", ready: "Current market value", winner: "offplan" },
  { factor: "Payment Terms", offPlan: "Flexible 60/40, 70/30 plans", ready: "Full payment or mortgage", winner: "offplan" },
  { factor: "Move-In Time", offPlan: "2-4 years (construction)", ready: "Immediate", winner: "ready" },
  { factor: "Unit Selection", offPlan: "Best floors & views available", ready: "Limited to remaining stock", winner: "offplan" },
  { factor: "Inspection", offPlan: "Plans & renders only", ready: "Physical walkthrough", winner: "ready" },
  { factor: "Capital Appreciation", offPlan: "15-30% by handover", ready: "5-10% annually", winner: "offplan" },
  { factor: "Rental Income", offPlan: "Starts after handover", ready: "Immediate cash flow", winner: "ready" },
  { factor: "Developer Risk", offPlan: "Delay/changes possible", ready: "No construction risk", winner: "ready" },
  { factor: "Modern Specs", offPlan: "Latest designs & tech", ready: "May need renovation", winner: "offplan" },
  { factor: "Financing Options", offPlan: "Developer payment plans", ready: "Bank mortgage required", winner: "offplan" },
];

const offPlanAdvantages = [
  "Lower entry prices (10-30% below completion value)",
  "Flexible payment plans spread over 2-4 years",
  "First choice of best units, floors, and views",
  "Highest capital appreciation potential",
  "Modern designs with latest smart home technology",
  "Post-handover payment options available",
  "No mortgage required (developer financing)"
];

const readyAdvantages = [
  "Immediate possession and use",
  "Instant rental income from day one",
  "Physical inspection before purchase",
  "No construction delays or changes",
  "Established community and amenities",
  "Easier mortgage approval",
  "What you see is what you get"
];

const investorProfiles = [
  {
    title: "Choose Off-Plan If You:",
    items: [
      "Can wait 2-4 years for returns",
      "Want maximum capital appreciation",
      "Prefer payment flexibility over mortgage",
      "Want first pick of premium units",
      "Are comfortable with construction phase risk"
    ],
    recommended: "offplan"
  },
  {
    title: "Choose Ready If You:",
    items: [
      "Need immediate rental income",
      "Want to move in right away",
      "Prefer certainty over potential upside",
      "Have mortgage pre-approval ready",
      "Want established community"
    ],
    recommended: "ready"
  }
];

export default function CompareOffPlanVsReady() {
  useDocumentMeta({
    title: "Off-Plan vs Ready Property Dubai | Complete Comparison 2026",
    description: "Compare Dubai off-plan vs ready properties. Off-plan offers 10-30% lower prices and flexible payments. Ready provides immediate possession. Find which suits your investment strategy.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "Off-Plan vs Ready" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Comparison Guide
                </Badge>
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-200 border-violet-400/30">
                  2026 Analysis
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Off-Plan vs Ready Property Dubai: Complete Comparison 2026
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-6 max-w-3xl">
                Should you invest in off-plan or ready property in Dubai? This comprehensive 
                comparison analyzes price differences, payment flexibility, ROI potential, and 
                risk factors to help you make the right investment decision.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dubai-off-plan-properties">
                  <Button size="lg" data-testid="button-explore-offplan">
                    Explore Off-Plan
                    <ChevronRight className="ml-2 h-4 w-4" />
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
          <h2 className="text-2xl font-bold mb-6">Quick Comparison Summary</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary">
              <CardContent className="pt-6 text-center">
                <Building className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="text-xl font-bold mb-2">Off-Plan Property</h3>
                <p className="text-muted-foreground mb-4">Buy during construction phase</p>
                <div className="text-2xl font-bold text-primary mb-2">10-30% Lower Price</div>
                <Badge variant="default">Best for: Capital Growth</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Key className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Ready Property</h3>
                <p className="text-muted-foreground mb-4">Buy completed property</p>
                <div className="text-2xl font-bold mb-2">Immediate Possession</div>
                <Badge variant="secondary">Best for: Rental Income</Badge>
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
                    <th className="text-left py-3 px-4 font-semibold bg-primary/5">Off-Plan</th>
                    <th className="text-left py-3 px-4 font-semibold">Ready</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'offplan' ? 'bg-green-500/10' : 'bg-primary/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'offplan' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.offPlan}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'ready' ? 'bg-green-500/10' : ''}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'ready' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.ready}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'offplan' ? 'default' : 'secondary'}>
                          {row.winner === 'offplan' ? 'Off-Plan' : 'Ready'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Score: Off-Plan wins 6 categories | Ready wins 4 categories
          </p>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Off-Plan Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {offPlanAdvantages.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Ready Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {readyAdvantages.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Which Is Right for You?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {investorProfiles.map((profile, index) => (
              <Card key={index} className={profile.recommended === 'offplan' ? 'border-primary' : ''}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">{profile.title}</h3>
                  <ul className="space-y-2">
                    {profile.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">ROI Comparison Example</h2>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Off-Plan Investment (3 Years)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Purchase Price (JVC):</span>
                      <span className="font-semibold">AED 500,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Down Payment (10%):</span>
                      <span className="font-semibold">AED 50,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Value at Handover (+25%):</span>
                      <span className="font-semibold">AED 625,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span>Capital Gain:</span>
                      <span className="font-semibold text-green-600">AED 125,000 (25%)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Ready Property Investment (3 Years)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Purchase Price (JVC):</span>
                      <span className="font-semibold">AED 625,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Rental Income (7.5% x 3yr):</span>
                      <span className="font-semibold">AED 140,625</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Value Appreciation (+15%):</span>
                      <span className="font-semibold">AED 718,750</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span>Total Return:</span>
                      <span className="font-semibold text-green-600">AED 234,375 (37%)</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Note: Ready property shows higher total return but requires larger upfront capital. 
                Off-plan offers better ROI on invested capital with payment flexibility.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Expert Verdict</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-md bg-primary/5">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Best for Capital Growth</div>
                  <Badge className="mt-2">Off-Plan</Badge>
                </div>
                <div className="text-center p-4 rounded-md bg-muted/30">
                  <Clock className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">Best for Rental Income</div>
                  <Badge variant="secondary" className="mt-2">Ready</Badge>
                </div>
                <div className="text-center p-4 rounded-md bg-primary/5">
                  <Calculator className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Best Payment Flexibility</div>
                  <Badge className="mt-2">Off-Plan</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Get Personalized Investment Advice"
          subtitle="Connect with consultants who can analyze your goals and recommend the best approach - off-plan, ready, or a strategic mix of both."
          ctaText="Get Expert Advice"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Comparison Guides"
          links={[
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans" },
            { href: "/off-plan-jvc", title: "JVC Properties" },
            { href: "/off-plan-business-bay", title: "Business Bay" },
            { href: "/off-plan-emaar", title: "Emaar Projects" },
            { href: "/off-plan-golden-visa", title: "Golden Visa" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
