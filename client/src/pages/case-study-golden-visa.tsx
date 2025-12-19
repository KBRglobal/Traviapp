import { Link } from "wouter";
import { Award, ChevronRight, TrendingUp, Calendar, MapPin, Users, CheckCircle, Quote, Plane } from "lucide-react";
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

export default function CaseStudyGoldenVisa() {
  useDocumentMeta({
    title: "Case Study: Golden Visa Through Property Investment | 10-Year UAE Residency",
    description: "How the Chen family obtained UAE Golden Visa through AED 2.2M property investment. Complete timeline, benefits, and family sponsorship details.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Case Studies", href: "/dubai-off-plan-properties" },
    { label: "Golden Visa Story" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  <Award className="h-3 w-3 mr-1" />
                  10-Year Visa
                </Badge>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                  Family Sponsored
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                How the Chen Family Secured UAE Golden Visa
              </h1>
              <p className="text-lg md:text-xl text-amber-100 mb-6 max-w-3xl">
                Singapore-based entrepreneur David Chen invested AED 2.2M in a Dubai Hills 
                apartment, qualifying his family of four for 10-year UAE Golden Visas with 
                full work and residency rights.
              </p>
              <div className="flex items-center gap-4 text-amber-100">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dubai Hills Estate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Family of 4</span>
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
                  <div className="text-center p-4 bg-amber-500/10 rounded-md">
                    <div className="text-2xl font-bold text-amber-600">AED 2.2M</div>
                    <div className="text-sm text-muted-foreground">Investment</div>
                  </div>
                  <div className="text-center p-4 bg-amber-500/10 rounded-md">
                    <div className="text-2xl font-bold text-amber-600">10 Years</div>
                    <div className="text-sm text-muted-foreground">Visa Duration</div>
                  </div>
                  <div className="text-center p-4 bg-amber-500/10 rounded-md">
                    <div className="text-2xl font-bold text-amber-600">4 People</div>
                    <div className="text-sm text-muted-foreground">Family Sponsored</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  David Chen, a tech company founder from Singapore, wanted to establish 
                  a base in the Middle East for business expansion. The UAE Golden Visa 
                  offered his family long-term stability without requiring local employment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Golden Visa Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-6 border-l-2 border-amber-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-amber-500" />
                  <h4 className="font-semibold">June 2024: Property Selection</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected 2-BR apartment in Emaar's Dubai Hills Estate for AED 2.2M 
                    (above AED 2M Golden Visa threshold).
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-amber-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-amber-500" />
                  <h4 className="font-semibold">July 2024: Purchase Completed</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Paid 40% deposit, SPA signed, Oqood registered. Title deed issued 
                    immediately as property was ready.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-amber-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-amber-500" />
                  <h4 className="font-semibold">August 2024: Visa Application</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Applied for Golden Visa through ICA with title deed, passport copies, 
                    medical fitness certificates, and family documents.
                  </p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-semibold text-green-600">September 2024: Visas Issued</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Received 10-year Golden Visas for David, spouse, and two children. 
                    Emirates IDs issued within 2 weeks.
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
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-amber-500 pl-4">
                  "The Golden Visa changed our family's life. My children can now attend 
                  Dubai schools, my wife can work freely, and I can base my regional 
                  operations here. The property investment that qualified us also 
                  appreciates in value - it's not just a visa cost, it's an asset."
                </blockquote>
                <p className="mt-4 text-sm text-muted-foreground">- David Chen, Tech Entrepreneur, Singapore</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Golden Visa Benefits Received</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">10-year renewable residency</span>
                      <p className="text-sm text-muted-foreground">No employer sponsorship required</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Family sponsorship</span>
                      <p className="text-sm text-muted-foreground">Spouse and children included on same visa</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Work permit rights</span>
                      <p className="text-sm text-muted-foreground">Can work or own business without sponsor</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Extended travel flexibility</span>
                      <p className="text-sm text-muted-foreground">No 6-month absence limit</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">UAE banking access</span>
                      <p className="text-sm text-muted-foreground">Full financial services as resident</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-amber-500/50">
              <CardHeader>
                <CardTitle className="text-lg">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-semibold">2-BR Apartment</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold">Dubai Hills</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Investment</span>
                  <span className="font-semibold">AED 2,200,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-semibold">Emaar</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Visa Type</span>
                  <span className="font-semibold text-amber-600">Golden Visa</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold">10 Years</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Processing Time</span>
                  <span className="font-semibold">3 Months</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Qualify for Golden Visa</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how a property investment of AED 2M+ can secure your 
                  family's future in Dubai.
                </p>
                <Link href="https://thrivestate.ae">
                  <Button className="w-full" data-testid="button-golden-visa-consultation">
                    <Award className="mr-2 h-4 w-4" />
                    Get Visa Guidance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <OffPlanCTASection
          title="Secure Your Golden Visa"
          subtitle="Discover Golden Visa-qualifying properties and get expert guidance on the application process."
          ctaText="Explore AED 2M+ Properties"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Resources"
          links={[
            { href: "/off-plan-golden-visa", title: "Golden Visa Guide" },
            { href: "/off-plan-emaar", title: "Emaar Properties" },
            { href: "/off-plan-dubai-hills", title: "Dubai Hills" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/tools-affordability-calculator", title: "Affordability Calculator" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
