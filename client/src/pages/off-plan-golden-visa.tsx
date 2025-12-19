import { Link } from "wouter";
import { Award, ChevronRight, Clock, Users, Globe, CheckCircle, FileText, Home, Briefcase } from "lucide-react";
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

const visaTypes = [
  { 
    investment: "AED 2M+", 
    duration: "10 Years", 
    type: "Golden Visa", 
    description: "Full residency with family sponsorship",
    benefits: ["Sponsor spouse & children", "No employer required", "Multiple entry", "Can work or start business"]
  },
  { 
    investment: "AED 750K+", 
    duration: "2 Years", 
    type: "Investor Visa", 
    description: "Property investor residency",
    benefits: ["Renewable visa", "Property ownership", "Bank account access", "UAE ID card"]
  }
];

const eligibleProperties = [
  { type: "Off-Plan", minValue: "AED 2M", condition: "Title deed issued at handover", visaType: "10-Year Golden" },
  { type: "Ready Property", minValue: "AED 2M", condition: "Immediate title deed", visaType: "10-Year Golden" },
  { type: "Multiple Properties", minValue: "AED 2M total", condition: "Combined value", visaType: "10-Year Golden" },
  { type: "Mortgaged Property", minValue: "AED 2M (equity)", condition: "Equity must meet threshold", visaType: "10-Year Golden" }
];

const applicationSteps = [
  { step: 1, title: "Property Purchase", description: "Buy off-plan property worth AED 2M+ from approved developers" },
  { step: 2, title: "Title Deed", description: "Receive title deed upon project handover or purchase ready property" },
  { step: 3, title: "Document Preparation", description: "Gather passport, photos, proof of investment, health insurance" },
  { step: 4, title: "Application Submission", description: "Apply through ICP or GDRFA Dubai portal with supporting documents" },
  { step: 5, title: "Approval & Issuance", description: "Receive 10-year Golden Visa within 2-4 weeks of submission" }
];

const familyBenefits = [
  { member: "Spouse", included: true, note: "Full 10-year visa" },
  { member: "Children (under 25)", included: true, note: "Full 10-year visa" },
  { member: "Parents", included: true, note: "1-year renewable visa" },
  { member: "Domestic Staff", included: true, note: "Based on visa holder status" }
];

export default function OffPlanGoldenVisa() {
  useDocumentMeta({
    title: "Dubai Golden Visa Through Property | AED 2M Investment Guide 2025",
    description: "Get UAE Golden Visa through Dubai off-plan property investment. AED 2M minimum for 10-year residency. Sponsor family, work freely, no employer required. Complete guide.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Investment Benefits", href: "/dubai-off-plan-investment-guide" },
    { label: "Golden Visa" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-golden-visa" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-yellow-900 via-amber-800 to-orange-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                  <Award className="h-3 w-3 mr-1" />
                  10-Year Residency
                </Badge>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  Family Sponsorship
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Dubai Golden Visa Through Property
              </h1>
              <p className="text-lg md:text-xl text-amber-100 mb-6 max-w-3xl">
                Invest AED 2 million or more in Dubai off-plan property and qualify for the UAE's 
                prestigious 10-year Golden Visa. Enjoy long-term residency, sponsor your family, 
                work freely, and build your future in one of the world's most dynamic cities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-start-golden-visa">
                  Start Visa Application
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

        <section className="grid md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">10 Years</div>
              <div className="text-sm text-muted-foreground">Visa Duration</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Home className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">AED 2M</div>
              <div className="text-sm text-muted-foreground">Minimum Investment</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">Full Family</div>
              <div className="text-sm text-muted-foreground">Sponsorship Rights</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">No Sponsor</div>
              <div className="text-sm text-muted-foreground">Required</div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Visa Options by Investment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {visaTypes.map((visa, index) => (
              <Card key={index} className={index === 0 ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{visa.type}</CardTitle>
                    <Badge variant={index === 0 ? "default" : "secondary"}>{visa.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">{visa.investment}</div>
                  <p className="text-muted-foreground mb-4">{visa.description}</p>
                  <ul className="space-y-2">
                    {visa.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Eligible Property Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eligibleProperties.map((property, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="font-semibold mb-2">{property.type}</div>
                  <div className="text-lg font-bold text-primary mb-2">{property.minValue}</div>
                  <Badge variant="outline" className="mb-2">{property.visaType}</Badge>
                  <p className="text-xs text-muted-foreground">{property.condition}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Application Process</h2>
          <div className="space-y-4">
            {applicationSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {step.step}
                </div>
                <div className="flex-1 pb-4 border-b last:border-0">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Family Sponsorship Benefits</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {familyBenefits.map((member, index) => (
                  <div key={index} className="text-center p-4 rounded-md bg-muted/30">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{member.member}</div>
                    <Badge variant={member.included ? "default" : "secondary"} className="my-2">
                      {member.included ? "Included" : "Not Included"}
                    </Badge>
                    <div className="text-xs text-muted-foreground">{member.note}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Off-Plan for Golden Visa</h2>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Important Considerations
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Golden Visa issued upon title deed receipt (at handover)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Off-plan purchase locks in property value today
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Multiple properties can combine to meet AED 2M threshold
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Property can be mortgaged if equity exceeds AED 2M
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Golden Visa Benefits
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      No minimum UAE residency requirement
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Auto-renewable if investment maintained
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Access to UAE banking and financial services
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Can start a business or work in UAE
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Get Your Golden Visa Through Property"
          subtitle="Connect with consultants who specialize in Golden Visa-eligible off-plan properties. Expert guidance from purchase to visa approval."
          ctaText="Start Visa Journey"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Investment Guides"
          links={[
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans" },
            { href: "/off-plan-crypto-payments", title: "Crypto Payments" },
            { href: "/best-off-plan-projects-dubai-2025", title: "Best Projects 2025" },
            { href: "/how-to-buy-dubai-off-plan", title: "How to Buy" },
            { href: "/off-plan-emaar", title: "Emaar Properties" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
