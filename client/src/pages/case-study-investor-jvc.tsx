import { Link } from "wouter";
import { User, ChevronRight, TrendingUp, Calendar, MapPin, DollarSign, CheckCircle, Quote } from "lucide-react";
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

export default function CaseStudyInvestorJVC() {
  useDocumentMeta({
    title: "Case Study: 143% ROI on JVC Off-Plan Investment | Real Investor Story",
    description: "Read how Sarah achieved 143% ROI on her AED 450K JVC off-plan investment over 3 years. Real numbers, timeline, and lessons learned from Dubai property investment.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Case Studies", href: "/dubai-off-plan-properties" },
    { label: "JVC Success Story" }
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
                  143% ROI
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  Real Case Study
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                How Sarah Made 143% ROI on Her First Dubai Investment
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-6 max-w-3xl">
                UK-based professional Sarah M. invested AED 450,000 in a JVC off-plan apartment 
                in 2021. By 2024, her property appreciated to AED 625,000 and generates 
                AED 45,000 annual rental income.
              </p>
              <div className="flex items-center gap-4 text-green-100">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Jumeirah Village Circle</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>2021 - 2024</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Investment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-md">
                    <div className="text-2xl font-bold text-primary">AED 450K</div>
                    <div className="text-sm text-muted-foreground">Purchase Price</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-md">
                    <div className="text-2xl font-bold text-green-600">AED 625K</div>
                    <div className="text-sm text-muted-foreground">Current Value</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-md">
                    <div className="text-2xl font-bold text-primary">143%</div>
                    <div className="text-sm text-muted-foreground">Total ROI</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Sarah, a marketing manager from London, had been considering international 
                  property investment for years. After researching Dubai's tax-free status 
                  and high rental yields, she decided to invest in an off-plan 1-bedroom 
                  apartment in JVC with a 60/40 payment plan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Investment Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-6 border-l-2 border-primary/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />
                  <h4 className="font-semibold">March 2021: Purchase Decision</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    After 3 months of research, Sarah purchased a 750 sq ft 1-BR apartment 
                    in The Portman by Ellington Properties for AED 450,000.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-primary/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />
                  <h4 className="font-semibold">March 2021 - March 2024: Construction</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Paid AED 7,500/month during 36-month construction period (60% = AED 270,000 total). 
                    Property value increased 20% during construction.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-primary/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />
                  <h4 className="font-semibold">March 2024: Handover</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Paid remaining 40% (AED 180,000) at handover. Immediately listed property 
                    for rent at AED 45,000/year (10% yield on purchase price).
                  </p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-semibold text-green-600">December 2024: Current Status</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Property valued at AED 625,000 (39% appreciation). Generating AED 3,750/month 
                    rental income. Total return: AED 220,000 (capital) + AED 33,750 (rent) = AED 253,750.
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
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4">
                  "The payment plan made it manageable on a regular salary. Instead of needing 
                  a large lump sum, I paid what felt like a slightly higher rent each month. 
                  When I got the keys, I already had tenants lined up. The rental income now 
                  covers my original monthly payments - it's essentially become free equity."
                </blockquote>
                <p className="mt-4 text-sm text-muted-foreground">- Sarah M., Marketing Manager, London</p>
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
                      <span className="font-semibold">Chose affordable entry point</span>
                      <p className="text-sm text-muted-foreground">JVC offered lowest prices with highest yield potential</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Selected reputable developer</span>
                      <p className="text-sm text-muted-foreground">Ellington Properties delivered on time with quality finish</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Used payment plan flexibility</span>
                      <p className="text-sm text-muted-foreground">60/40 plan allowed manageable monthly payments</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Planned rental strategy early</span>
                      <p className="text-sm text-muted-foreground">Had property management and tenants ready at handover</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-semibold">1-BR Apartment</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold">JVC</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-semibold">AED 450,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Payment Plan</span>
                  <span className="font-semibold">60/40</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Current Value</span>
                  <span className="font-semibold text-green-600">AED 625,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Capital Gain</span>
                  <span className="font-semibold text-green-600">AED 175,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Rental Income (9mo)</span>
                  <span className="font-semibold text-green-600">AED 33,750</span>
                </div>
                <div className="flex justify-between py-2 bg-green-500/10 rounded-md px-2">
                  <span className="font-semibold">Total ROI</span>
                  <span className="font-bold text-green-600">143%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Want Similar Results?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with consultants who can help you find investment 
                  opportunities like Sarah's.
                </p>
                <Link href="https://thrivestate.ae">
                  <Button className="w-full" data-testid="button-get-started">
                    Get Expert Guidance
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <OffPlanCTASection
          title="Start Your Investment Journey"
          subtitle="Discover off-plan opportunities in JVC and other high-yield areas with flexible payment plans."
          ctaText="Explore JVC Properties"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Resources"
          links={[
            { href: "/off-plan-jvc", title: "JVC Properties" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans" },
            { href: "/compare-jvc-vs-dubai-south", title: "JVC vs Dubai South" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
