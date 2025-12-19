import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  TrendingUp, Building2, Shield, ChevronRight, 
  CheckCircle2, Percent, AlertTriangle, Target
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
import { 
  OffPlanStatsBar, 
  OffPlanBreadcrumb, 
  OffPlanSubNav,
  TrustSignals,
  RelatedLinks,
  OffPlanCTASection 
} from "@/components/off-plan-shared";

const ROI_DATA = [
  { area: "Dubai South", preHand: "35-45%", rental: "8-10%", type: "Growth" },
  { area: "JVC", preHand: "25-35%", rental: "8-9%", type: "Balanced" },
  { area: "Business Bay", preHand: "20-30%", rental: "7-8%", type: "Established" },
  { area: "Dubai Marina", preHand: "15-25%", rental: "6-7%", type: "Premium" },
  { area: "Palm Jumeirah", preHand: "10-20%", rental: "5-6%", type: "Trophy" },
];

const INVESTMENT_STRATEGIES = [
  {
    name: "Capital Appreciation Focus",
    icon: TrendingUp,
    description: "Buy early in development cycle, sell before or at handover for maximum gains",
    idealFor: "Investors seeking 20-40% returns in 2-4 years",
    risk: "Medium",
    minCapital: "AED 450K",
    approach: [
      "Target pre-launch or Phase 1 pricing",
      "Focus on emerging areas (Dubai South, Al Furjan)",
      "Track developer reputation for on-time delivery",
      "Plan exit strategy before handover"
    ]
  },
  {
    name: "Rental Yield Strategy",
    icon: Percent,
    description: "Hold through handover and beyond for consistent rental income",
    idealFor: "Long-term investors seeking 6-10% annual yields",
    risk: "Low-Medium",
    minCapital: "AED 650K",
    approach: [
      "Prioritize high-yield areas (JVC, Dubai South)",
      "Choose 1-2 bedroom units for tenant demand",
      "Factor in service charges and management fees",
      "Consider post-handover payment plans"
    ]
  },
  {
    name: "Flip at Milestone",
    icon: Target,
    description: "Assign contract to new buyer at key construction milestones",
    idealFor: "Active investors with market knowledge",
    risk: "Medium-High",
    minCapital: "AED 200K (down payment only)",
    approach: [
      "Secure lowest possible entry price",
      "Monitor market sentiment and demand",
      "Build network of potential assignees",
      "Understand NOC and assignment fees"
    ]
  },
];

const RISKS_AND_MITIGATIONS = [
  {
    risk: "Construction Delays",
    mitigation: "Choose developers with 90%+ on-time track record (Emaar, Sobha)",
    severity: "Medium"
  },
  {
    risk: "Market Downturn",
    mitigation: "Maintain 20% buffer, avoid over-leverage, diversify across areas",
    severity: "Medium"
  },
  {
    risk: "Developer Default",
    mitigation: "DLD escrow protection ensures 100% refund if project cancelled",
    severity: "Low"
  },
  {
    risk: "Currency Fluctuation",
    mitigation: "AED pegged to USD since 1997, minimal forex risk for USD holders",
    severity: "Low"
  },
  {
    risk: "Oversupply in Area",
    mitigation: "Research RERA completion forecasts, favor master communities",
    severity: "Medium"
  },
];

const FAQS = [
  {
    q: "What is the minimum investment for Dubai off-plan property?",
    a: "Entry-level off-plan properties in Dubai start from AED 450,000-500,000, typically studios or 1-bedroom apartments in emerging areas like JVC or Dubai South. With payment plans requiring only 5-20% down, initial investment can be as low as AED 90,000-100,000."
  },
  {
    q: "How do I calculate ROI on off-plan property?",
    a: "ROI = (Sale Price - Purchase Price - All Costs) / Total Investment x 100. Include DLD fees (4%), agent commission (2%), service charges, and any mortgage costs. Pre-handover appreciation typically ranges 15-40% depending on area and timing."
  },
  {
    q: "Can foreigners invest in Dubai off-plan property?",
    a: "Yes. Over 200 nationalities can purchase freehold property in designated areas across Dubai. No residency requirement, though purchases over AED 750K qualify for 2-year renewable investor visa, and AED 2M+ qualifies for 10-year Golden Visa."
  },
  {
    q: "Is off-plan safer than ready property?",
    a: "Both have DLD protection. Off-plan carries construction timeline risk but offers lower entry prices and appreciation potential. Ready property provides immediate rental income but at higher purchase prices. Risk profile depends on investment goals."
  },
  {
    q: "What happens if developer goes bankrupt?",
    a: "All payments are held in DLD escrow accounts. If a project is cancelled, investors receive 100% refund within 60 days. Dubai's RERA strictly monitors developer financial health and project progress."
  },
  {
    q: "Should I invest in 2025 with current market prices?",
    a: "Dubai property prices are 15-20% below 2014 peak in real terms. Population growth of 3% annually, Expo 2020 legacy infrastructure, and 2040 Urban Master Plan support long-term appreciation. Entry timing matters less than exit strategy."
  },
];

const RELATED_LINKS = [
  { title: "How to Buy Off-Plan in Dubai", href: "/how-to-buy-dubai-off-plan", description: "Step-by-step purchase guide" },
  { title: "Understanding Payment Plans", href: "/dubai-off-plan-payment-plans", description: "80/20, post-handover options" },
  { title: "Best Projects 2025", href: "/best-off-plan-projects-dubai-2025", description: "Top investment opportunities" },
  { title: "Crypto Payments Guide", href: "/dubai-off-plan-crypto-payments", description: "BTC, USDT, ETH accepted" },
  { title: "Golden Visa Through Property", href: "/dubai-off-plan-golden-visa", description: "10-year residency pathway" },
  { title: "Off-Plan vs Ready Property", href: "/dubai-off-plan-vs-ready-property", description: "Compare investment options" },
];

export default function OffPlanInvestmentGuide() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    document.title = "Dubai Off-Plan Investment Guide 2025 | ROI, Strategies & Risk Analysis";
  }, []);

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "Investment Guide" }
      ]} />
      <OffPlanSubNav activeHref="/dubai-off-plan-investment-guide" />

      <main className="bg-background">
        {/* Hero */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Investment Guide 2025</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Dubai Off-Plan Investment Guide
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Master off-plan investing with data-driven strategies, ROI projections, and risk analysis 
              tailored for international investors seeking 15-40% returns.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dubai-off-plan-properties">
                <Button size="lg" className="rounded-full" data-testid="button-view-projects">
                  <Building2 className="w-5 h-5 mr-2" />
                  View Projects
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full" data-testid="button-speak-advisor">
                Speak with Advisor
              </Button>
            </div>
          </div>
        </section>

        {/* ROI Comparison */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">ROI Comparison by Area</h2>
            <p className="text-muted-foreground mb-8">
              Historical appreciation and rental yield data based on 2020-2024 transactions
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Area</th>
                    <th className="text-left py-3 px-4 font-semibold">Pre-Handover Gain</th>
                    <th className="text-left py-3 px-4 font-semibold">Rental Yield</th>
                    <th className="text-left py-3 px-4 font-semibold">Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {ROI_DATA.map((row) => (
                    <tr key={row.area} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{row.area}</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-500">{row.preHand}</td>
                      <td className="py-3 px-4">{row.rental}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{row.type}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Source: DLD Transaction Data, Bayut Market Reports 2024. Past performance does not guarantee future results.
            </p>
          </div>
        </section>

        {/* Investment Strategies */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Investment Strategies</h2>
            <p className="text-muted-foreground mb-8">
              Choose the approach that matches your capital, risk tolerance, and timeline
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {INVESTMENT_STRATEGIES.map((strategy) => {
                const Icon = strategy.icon;
                return (
                  <Card key={strategy.name} className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{strategy.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ideal For</span>
                        <span className="font-medium text-right max-w-[60%]">{strategy.idealFor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Level</span>
                        <Badge variant={strategy.risk === "Low-Medium" ? "secondary" : "outline"}>
                          {strategy.risk}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Capital</span>
                        <span className="font-medium">{strategy.minCapital}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-xs font-medium mb-2">Key Approach:</p>
                      <ul className="space-y-1">
                        {strategy.approach.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Risk Analysis */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Risk Analysis & Mitigation</h2>
            <p className="text-muted-foreground mb-8">
              Understanding and managing investment risks in Dubai's regulated market
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {RISKS_AND_MITIGATIONS.map((item) => (
                <Card key={item.risk} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      item.severity === "Low" ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                    }`}>
                      {item.severity === "Low" ? (
                        <Shield className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.risk}</h3>
                        <Badge variant={item.severity === "Low" ? "secondary" : "outline"} className="text-xs">
                          {item.severity} Risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.mitigation}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">15-40%</p>
                <p className="text-sm text-muted-foreground">Pre-Handover Gains</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">0%</p>
                <p className="text-sm text-muted-foreground">Property Tax</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">6-10%</p>
                <p className="text-sm text-muted-foreground">Net Rental Yield</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Escrow Protection</p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Investment FAQs</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Common questions about off-plan property investment in Dubai
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
          title="Start Your Investment Journey"
          subtitle="Get personalized investment recommendations from our Dubai-based advisors"
          ctaText="Speak with Advisor"
          onCtaClick={() => setWizardOpen(true)}
        />
      </main>
    </>
  );
}
