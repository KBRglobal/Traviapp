import { Link } from "wouter";
import { Calendar, ChevronRight, Clock, TrendingUp, Home, CheckCircle, Calculator, Percent, Building } from "lucide-react";
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

const paymentExamples = [
  { 
    structure: "60/40",
    construction: "60%",
    handover: "40%",
    postHandover: "2-3 years",
    description: "Most common plan - 60% during construction, 40% over 2-3 years post-handover"
  },
  { 
    structure: "70/30",
    construction: "70%",
    handover: "30%",
    postHandover: "2 years",
    description: "Higher upfront payment, lower post-handover burden"
  },
  { 
    structure: "50/50",
    construction: "50%",
    handover: "50%",
    postHandover: "3-5 years",
    description: "Balanced split with extended post-handover period"
  },
  { 
    structure: "80/20",
    construction: "80%",
    handover: "20%",
    postHandover: "1-2 years",
    description: "Minimal post-handover exposure, larger initial commitment"
  }
];

const postHandoverBenefits = [
  { title: "Rental Income Covers Payments", description: "Use rental income to pay post-handover installments", icon: TrendingUp },
  { title: "Extended Cash Flow", description: "Spread payments over 2-5 years after moving in", icon: Calendar },
  { title: "Lower Initial Burden", description: "Reduce upfront capital requirements significantly", icon: Calculator },
  { title: "No Bank Financing", description: "Developer financing without mortgage requirements", icon: Building }
];

const developerPlans = [
  { developer: "Emaar", typical: "60/40 to 80/20", postPeriod: "2-3 years", interest: "0%" },
  { developer: "DAMAC", typical: "60/40 to 70/30", postPeriod: "2-5 years", interest: "0%" },
  { developer: "Sobha", typical: "60/40", postPeriod: "2-3 years", interest: "0%" },
  { developer: "Nakheel", typical: "70/30 to 80/20", postPeriod: "2 years", interest: "0%" },
  { developer: "Meraas", typical: "60/40", postPeriod: "2-3 years", interest: "0%" }
];

export default function OffPlanPostHandover() {
  useDocumentMeta({
    title: "Post-Handover Payment Plans Dubai | Off-Plan Developer Financing 2025",
    description: "Explore Dubai off-plan post-handover payment plans. Pay 40-50% after receiving keys. Interest-free developer financing for 2-5 years. Use rental income to cover payments.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Payment Plans", href: "/dubai-off-plan-payment-plans" },
    { label: "Post-Handover" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-post-handover" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-blue-900 via-indigo-800 to-violet-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                  <Calendar className="h-3 w-3 mr-1" />
                  Post-Handover Plans
                </Badge>
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                  0% Interest
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Post-Handover Payment Plans
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl">
                Continue paying for your Dubai property after you receive the keys. Post-handover 
                payment plans let you spread 30-50% of the price over 2-5 years, often covered by 
                rental income. Interest-free developer financing with no mortgage required.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-explore-post-handover">
                  Explore Plans
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/dubai-off-plan-payment-plans">
                  <Button size="lg" variant="outline" data-testid="button-all-payment-plans">
                    All Payment Options
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-4 mb-12">
          {postHandoverBenefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <benefit.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold mb-1">{benefit.title}</div>
                <div className="text-sm text-muted-foreground">{benefit.description}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Post-Handover Structures</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {paymentExamples.map((plan, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{plan.structure} Plan</CardTitle>
                    <Badge variant="secondary">{plan.postHandover} post-handover</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 rounded-md bg-muted/30">
                      <div className="text-2xl font-bold text-primary">{plan.construction}</div>
                      <div className="text-xs text-muted-foreground">During Construction</div>
                    </div>
                    <div className="text-center p-3 rounded-md bg-muted/30">
                      <div className="text-2xl font-bold text-primary">{plan.handover}</div>
                      <div className="text-xs text-muted-foreground">Post-Handover</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How Rental Income Covers Payments</h2>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Example Calculation</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Property Value:</span>
                      <span className="font-semibold">AED 1,500,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Post-Handover (40%):</span>
                      <span className="font-semibold">AED 600,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Post-Handover Period:</span>
                      <span className="font-semibold">3 years</span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Quarterly Payment:</span>
                      <span className="font-semibold">AED 50,000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-primary text-primary-foreground rounded">
                      <span>Monthly Rental Income:</span>
                      <span className="font-semibold">~AED 8,000</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Key Benefits</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Rental income (7-8% yield) substantially covers payments
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Zero interest on deferred payments
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      No bank approval or mortgage fees required
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Property generates income while you pay
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Flexibility to live in property or rent out
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Developer Post-Handover Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Developer</th>
                  <th className="text-left py-3 px-4">Typical Structure</th>
                  <th className="text-left py-3 px-4">Post Period</th>
                  <th className="text-left py-3 px-4">Interest</th>
                </tr>
              </thead>
              <tbody>
                {developerPlans.map((plan, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{plan.developer}</td>
                    <td className="py-3 px-4">{plan.typical}</td>
                    <td className="py-3 px-4">{plan.postPeriod}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        {plan.interest}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">FAQs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I get title deed with post-handover?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Title deed issuance varies by developer. Some issue upon handover (you own with 
                  payment obligation), others upon full payment. Confirm with your consultant.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I miss a payment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Developers typically offer grace periods. Persistent defaults may trigger penalties 
                  or, in extreme cases, contract termination. Always communicate early if facing 
                  difficulties.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I sell during post-handover?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can sell and transfer the payment obligation to the buyer, or settle 
                  remaining payments from sale proceeds. Some developers require NOC for transfer.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this better than a mortgage?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Post-handover is interest-free but shorter term. Mortgages offer longer terms 
                  but charge interest. For investors, post-handover is often more cost-effective.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Find Post-Handover Payment Plans"
          subtitle="Connect with consultants who specialize in post-handover financing. Find properties where rental income covers your payments."
          ctaText="Explore Options"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Payment Guides"
          links={[
            { href: "/dubai-off-plan-payment-plans", title: "All Payment Plans" },
            { href: "/off-plan-escrow", title: "Escrow Protection" },
            { href: "/off-plan-crypto-payments", title: "Crypto Payments" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/how-to-buy-dubai-off-plan", title: "How to Buy" },
            { href: "/off-plan-vs-ready", title: "Off-Plan vs Ready" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
