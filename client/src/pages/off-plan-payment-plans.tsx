import { useState } from "react";
import { Link } from "wouter";
import { 
  Building2, CheckCircle2, DollarSign, 
  Calendar, ChevronRight, Bitcoin, CreditCard
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PublicNav } from "@/components/public-nav";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { 
  OffPlanStatsBar, 
  OffPlanBreadcrumb, 
  OffPlanSubNav,
  TrustSignals,
  RelatedLinks,
  OffPlanCTASection 
} from "@/components/off-plan-shared";

const PAYMENT_PLAN_TYPES = [
  {
    name: "80/20 Standard",
    popularWith: "Most Common",
    structure: "80% during construction, 20% at handover",
    example: "For AED 1M property: ~AED 200K down, AED 600K during construction, AED 200K at handover",
    pros: ["Balanced cash flow", "Lower initial commitment", "Aligned with construction progress"],
    cons: ["Larger final payment", "Construction risk exposure"],
    bestFor: "Investors with steady income seeking capital appreciation"
  },
  {
    name: "60/40 Split",
    popularWith: "Premium Developers",
    structure: "60% during construction, 40% at handover",
    example: "For AED 1M property: ~AED 200K down, AED 400K during construction, AED 400K at handover",
    pros: ["Lower construction-phase burden", "More flexibility pre-handover", "Better for flipping"],
    cons: ["Large final payment required", "May need financing at handover"],
    bestFor: "Investors planning to flip before or at handover"
  },
  {
    name: "Post-Handover Plans",
    popularWith: "New Launches",
    structure: "40-60% during construction, remaining over 2-5 years post-handover",
    example: "For AED 1M property: AED 400K until handover, then AED 10K/month for 5 years",
    pros: ["Rental income offsets payments", "Lower upfront requirement", "Easier qualification"],
    cons: ["Higher total cost (interest-free premium)", "Long-term commitment"],
    bestFor: "Investors planning to hold and rent, lower initial capital"
  },
  {
    name: "1% Monthly",
    popularWith: "Select Developers",
    structure: "1% per month until handover, remaining at completion",
    example: "For AED 1M property: AED 10K/month for 36 months, AED 640K at handover",
    pros: ["Very low monthly burden", "Predictable payments", "Good for budget planning"],
    cons: ["Large balloon payment at end", "Longer commitment"],
    bestFor: "Investors preferring small regular payments over lump sums"
  },
];

const EXAMPLE_BREAKDOWN = {
  propertyPrice: "AED 1,500,000",
  plan: "60/40 with Post-Handover",
  schedule: [
    { milestone: "Booking", percent: "10%", amount: "AED 150,000", when: "Immediately" },
    { milestone: "SPA Signing", percent: "10%", amount: "AED 150,000", when: "Within 30 days" },
    { milestone: "20% Construction", percent: "10%", amount: "AED 150,000", when: "Month 8" },
    { milestone: "40% Construction", percent: "10%", amount: "AED 150,000", when: "Month 16" },
    { milestone: "60% Construction", percent: "10%", amount: "AED 150,000", when: "Month 24" },
    { milestone: "80% Construction", percent: "10%", amount: "AED 150,000", when: "Month 32" },
    { milestone: "Handover", percent: "20%", amount: "AED 300,000", when: "Month 36" },
    { milestone: "Post-Handover (2 years)", percent: "20%", amount: "AED 300,000", when: "Monthly" },
  ]
};

const PAYMENT_METHODS = [
  {
    method: "Bank Transfer",
    icon: CreditCard,
    description: "International wire transfer to developer escrow",
    notes: "Most common, 2-5 business days, SWIFT charges apply"
  },
  {
    method: "Cryptocurrency",
    icon: Bitcoin,
    description: "BTC, USDT, ETH via VARA-licensed gateway",
    notes: "Instant AED conversion, 24-48hr processing"
  },
  {
    method: "Manager's Cheque",
    icon: DollarSign,
    description: "UAE bank issued cheque",
    notes: "For UAE residents, immediate clearing"
  },
  {
    method: "Post-Dated Cheques",
    icon: Calendar,
    description: "Series of cheques for installments",
    notes: "UAE residents only, common for construction payments"
  },
];

const FAQS = [
  {
    q: "Are off-plan payment plans interest-free?",
    a: "Yes, developer payment plans in Dubai are typically interest-free during construction. Post-handover plans may have a slight premium (3-5%) built into the base price but carry no explicit interest charges."
  },
  {
    q: "What happens if I miss a payment?",
    a: "Most developers provide a 14-30 day grace period. Late payments may incur penalties (typically 1-2% per month). Persistent defaults can lead to contract termination with partial refund of paid amounts."
  },
  {
    q: "Can I negotiate payment plans?",
    a: "Yes, especially for larger units, multiple purchases, or during launch phases. Developers may offer enhanced plans with lower down payments or extended post-handover terms for early buyers."
  },
  {
    q: "Do I need a mortgage with payment plans?",
    a: "Not during construction as payment plans are developer-financed. At handover, you may need a mortgage for the final lump sum if not paying cash. Pre-approval before handover is recommended."
  },
  {
    q: "What is the minimum down payment?",
    a: "Minimum down payments range from 5% to 20% depending on developer. Premium developers like Emaar typically require 10-20%, while newer developers may offer 5-10% to attract buyers."
  },
  {
    q: "Can I pay the full amount upfront for discount?",
    a: "Yes, many developers offer 5-10% discount for full upfront payment. This is most common during launch phases and can represent significant savings on larger purchases."
  },
];

const RELATED_LINKS = [
  { title: "Investment Guide", href: "/dubai-off-plan-investment-guide", description: "ROI strategies" },
  { title: "How to Buy", href: "/how-to-buy-dubai-off-plan", description: "Step-by-step process" },
  { title: "Best Projects 2026", href: "/best-off-plan-projects-dubai-2026", description: "Top opportunities" },
  { title: "Crypto Payments", href: "/dubai-off-plan-crypto-payments", description: "BTC, USDT accepted" },
  { title: "Post-Handover Plans", href: "/dubai-off-plan-post-handover", description: "Extended payment options" },
];

export default function OffPlanPaymentPlans() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useDocumentMeta({
    title: "Dubai Off-Plan Payment Plans 2026 | 80/20, Post-Handover, Monthly Options",
    description: "Complete guide to Dubai off-plan payment plans: 80/20, 60/40, post-handover, and 1% monthly options. Interest-free developer financing with crypto payment acceptance.",
    ogType: "article"
  });

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Payment Plans" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-payment-plans" />

      <main className="bg-background">
        {/* Hero */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Payment Plans 2026</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Dubai Off-Plan Payment Plans
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Flexible, interest-free payment structures from 5% down to post-handover plans 
              stretching 5+ years. Including cryptocurrency payment options.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dubai-off-plan-properties">
                <Button size="lg" className="rounded-full" data-testid="button-find-plans">
                  <Building2 className="w-5 h-5 mr-2" />
                  Find Projects with Best Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">5-20%</p>
                <p className="text-sm text-muted-foreground">Down Payment</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">0%</p>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">2-5 Years</p>
                <p className="text-sm text-muted-foreground">Post-Handover Terms</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">BTC/USDT</p>
                <p className="text-sm text-muted-foreground">Crypto Accepted</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Payment Plan Types */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Payment Plan Structures</h2>
            <p className="text-muted-foreground mb-8">
              Developer-financed options for every investor profile
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {PAYMENT_PLAN_TYPES.map((plan) => (
                <Card key={plan.name} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <Badge variant="secondary">{plan.popularWith}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{plan.structure}</p>
                  <div className="bg-muted/50 rounded-md p-3 mb-4">
                    <p className="text-xs text-muted-foreground">{plan.example}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-500 mb-1">Advantages</p>
                      <ul className="space-y-1">
                        {plan.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-500 mb-1">Considerations</p>
                      <ul className="space-y-1">
                        {plan.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-1 text-xs text-muted-foreground">
                            <ChevronRight className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-3">
                    <span className="font-semibold">Best For:</span> {plan.bestFor}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Example Breakdown */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Example Payment Schedule</h2>
            <p className="text-muted-foreground mb-8 text-center">
              {EXAMPLE_BREAKDOWN.plan} for {EXAMPLE_BREAKDOWN.propertyPrice} property
            </p>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Milestone</th>
                      <th className="text-center py-3 px-4 font-semibold">%</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                      <th className="text-right py-3 px-4 font-semibold">Timing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXAMPLE_BREAKDOWN.schedule.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 px-4">{row.milestone}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline">{row.percent}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">{row.amount}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground text-sm">{row.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Accepted Payment Methods</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Multiple options including cryptocurrency
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <Card key={method.method} className="p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{method.method}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <p className="text-xs text-muted-foreground">{method.notes}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Payment Plan FAQs</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Common questions about payment structures
            </p>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left" data-testid={`accordion-faq-${index}`}>
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <TrustSignals />
        <RelatedLinks title="Related Guides" links={RELATED_LINKS} />

        <OffPlanCTASection
          title="Find Projects with Best Payment Plans"
          subtitle="Compare payment structures across 8,000+ off-plan properties"
          ctaText="Explore Projects"
          onCtaClick={() => setWizardOpen(true)}
        />
      </main>
    </>
  );
}
