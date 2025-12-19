import { Link } from "wouter";
import { TrendingUp, ChevronRight, Clock, Calendar, DollarSign, CheckCircle, Quote, BarChart } from "lucide-react";
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

export default function CaseStudyInvestorFlip() {
  useDocumentMeta({
    title: "Case Study: Off-Plan Flip Strategy | 52% Return in 18 Months",
    description: "How an investor flipped a DAMAC Lagoons townhouse for 52% profit. Entry at AED 1.1M, exit at AED 1.67M before handover. Detailed strategy breakdown.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Case Studies", href: "/dubai-off-plan-properties" },
    { label: "Off-Plan Flip Story" }
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
                  Flip Strategy
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  52% Return
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Off-Plan Flip: 52% Return in 18 Months
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-6 max-w-3xl">
                Dubai-based investor Michael secured a DAMAC Lagoons townhouse at launch 
                for AED 1.1M, then sold his contract 18 months later for AED 1.67M - 
                before construction even completed. A masterclass in off-plan flipping.
              </p>
              <div className="flex items-center gap-4 text-green-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>18-Month Hold</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>AED 570K Profit</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>The Numbers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-500/10 rounded-md">
                    <div className="text-xl font-bold text-green-600">AED 1.1M</div>
                    <div className="text-sm text-muted-foreground">Entry Price</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-md">
                    <div className="text-xl font-bold text-green-600">AED 1.67M</div>
                    <div className="text-sm text-muted-foreground">Exit Price</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-md">
                    <div className="text-xl font-bold text-green-600">AED 570K</div>
                    <div className="text-sm text-muted-foreground">Gross Profit</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-md">
                    <div className="text-xl font-bold text-green-600">52%</div>
                    <div className="text-sm text-muted-foreground">Total Return</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Michael, an experienced property investor, spotted DAMAC Lagoons during 
                  launch phase. He identified early-stage pricing as an opportunity for 
                  capital appreciation before handover.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flip Strategy Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-6 border-l-2 border-green-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-semibold">January 2023: Launch Purchase</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Secured 3-BR townhouse at DAMAC Lagoons for AED 1.1M at project launch. 
                    Paid 20% deposit (AED 220K) to secure the unit.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-green-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-semibold">June 2023: 40% Paid</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Completed 40% milestone payments (AED 440K total paid). Project 
                    construction progressing, market interest growing.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-green-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-semibold">December 2023: Market Monitoring</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tracked secondary market prices. Similar units now listing at 
                    AED 1.5M-1.7M. Decided to exit before further payments due.
                  </p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-semibold text-green-600">July 2024: Contract Assignment</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sold contract to new buyer for AED 1.67M via Oqood transfer. 
                    Net profit AED 520K after fees (52% return on purchase price).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Quote className="h-5 w-5" />
                  Investor Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-green-500 pl-4">
                  "The key to off-plan flipping is buying at launch from developers with 
                  strong track records. DAMAC Lagoons had the waterfront concept, central 
                  location, and payment plan that attracted buyers. I only paid 40% before 
                  selling - that's leverage working for me."
                </blockquote>
                <p className="mt-4 text-sm text-muted-foreground">- Michael K., Property Investor</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Success Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Launch phase entry</span>
                      <p className="text-sm text-muted-foreground">Captured maximum appreciation potential</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Established developer</span>
                      <p className="text-sm text-muted-foreground">DAMAC reputation attracted resale buyers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Unique concept</span>
                      <p className="text-sm text-muted-foreground">Lagoon living differentiated from competition</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Early exit timing</span>
                      <p className="text-sm text-muted-foreground">Sold before 60% payment milestone</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-green-500/50">
              <CardHeader>
                <CardTitle className="text-lg">Return Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Entry Price</span>
                  <span className="font-semibold">AED 1,100,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-semibold">AED 440,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Exit Price</span>
                  <span className="font-semibold">AED 1,670,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Gross Profit</span>
                  <span className="font-semibold text-green-600">AED 570,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Fees (4%)</span>
                  <span className="font-semibold">AED 50,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Net Profit</span>
                  <span className="font-semibold text-green-600">AED 520,000</span>
                </div>
                <div className="flex justify-between py-2 bg-green-500/10 rounded-md px-2">
                  <span className="font-semibold">ROI on Capital</span>
                  <span className="font-bold text-green-600">118%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Learn Flip Strategies</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Get expert guidance on identifying flip opportunities in Dubai's 
                  off-plan market.
                </p>
                <Link href="https://thrivestate.ae">
                  <Button className="w-full" data-testid="button-flip-consultation">
                    <BarChart className="mr-2 h-4 w-4" />
                    Get Investment Advice
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <OffPlanCTASection
          title="Explore Flip Opportunities"
          subtitle="Connect with advisors who can identify launch-phase projects with high appreciation potential."
          ctaText="Get Flip Guidance"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Investment Resources"
          links={[
            { href: "/off-plan-damac", title: "DAMAC Properties" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/dubai-roi-rental-yields", title: "ROI Guide" },
            { href: "/compare-off-plan-vs-ready", title: "Off-Plan vs Ready" },
            { href: "/case-study-jvc-investor", title: "JVC Success Story" },
            { href: "/glossary", title: "Investment Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
