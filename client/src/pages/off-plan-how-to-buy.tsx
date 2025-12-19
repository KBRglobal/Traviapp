import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Building2, CheckCircle2, FileText, Shield, 
  Clock, Users, Search, ClipboardCheck, PenTool, 
  Key, Banknote, Wallet
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

const PURCHASE_STEPS = [
  {
    step: 1,
    title: "Research & Selection",
    icon: Search,
    duration: "1-2 weeks",
    description: "Identify projects matching your investment criteria",
    actions: [
      "Define budget, timeline, and investment goals",
      "Research developer track records and delivery history",
      "Compare locations based on ROI data and growth potential",
      "Shortlist 3-5 projects for detailed evaluation"
    ],
    tip: "Focus on developers with 90%+ on-time delivery: Emaar, Sobha, Meraas"
  },
  {
    step: 2,
    title: "Site Visit & Due Diligence",
    icon: ClipboardCheck,
    duration: "1-2 days",
    description: "Verify project details and conduct physical inspection",
    actions: [
      "Visit sales gallery and model apartments",
      "Review floor plans and unit specifications",
      "Check RERA registration and escrow account details",
      "Verify developer licenses and project approvals"
    ],
    tip: "Request Oqood (initial registration) certificate number to verify DLD status"
  },
  {
    step: 3,
    title: "Reservation & EOI",
    icon: PenTool,
    duration: "Same day",
    description: "Secure your chosen unit with a reservation deposit",
    actions: [
      "Complete Expression of Interest (EOI) form",
      "Pay reservation deposit (typically AED 25,000-50,000)",
      "Receive unit allocation confirmation",
      "Deposit fully refundable if SPA not signed within period"
    ],
    tip: "EOI secures your unit but is non-binding until SPA is signed"
  },
  {
    step: 4,
    title: "SPA Signing",
    icon: FileText,
    duration: "7-14 days",
    description: "Sign the Sales Purchase Agreement and pay first installment",
    actions: [
      "Review SPA terms with independent lawyer (recommended)",
      "Sign SPA in presence of developer representative",
      "Pay down payment (typically 10-20% of property value)",
      "Receive copy of signed SPA and payment receipt"
    ],
    tip: "SPA should include handover date, payment schedule, and penalty clauses"
  },
  {
    step: 5,
    title: "DLD Registration",
    icon: Shield,
    duration: "3-5 days",
    description: "Register your property with Dubai Land Department",
    actions: [
      "Developer submits Oqood registration application",
      "Pay DLD registration fee (4% of property value)",
      "Receive Oqood certificate (initial registration)",
      "Property officially registered under your name"
    ],
    tip: "DLD registration protects your ownership even during construction"
  },
  {
    step: 6,
    title: "Construction Payments",
    icon: Wallet,
    duration: "2-4 years",
    description: "Make milestone payments as per agreed schedule",
    actions: [
      "Payments linked to construction milestones",
      "Receive progress updates from developer",
      "Developer draws from escrow only upon milestone completion",
      "Final 20-40% typically due at handover"
    ],
    tip: "Payments go to RERA-regulated escrow account, not developer directly"
  },
  {
    step: 7,
    title: "Handover & Title Deed",
    icon: Key,
    duration: "Upon completion",
    description: "Receive your property and final ownership documents",
    actions: [
      "Complete snagging inspection",
      "Pay final installment and service charges",
      "Receive keys and access cards",
      "Title deed transferred to your name"
    ],
    tip: "Conduct thorough snagging; developer must fix defects before final payment"
  },
];

const DOCUMENTS_REQUIRED = [
  { doc: "Valid Passport", note: "Clear copy of first page", required: true },
  { doc: "Emirates ID", note: "If UAE resident", required: false },
  { doc: "Visa Copy", note: "If UAE resident", required: false },
  { doc: "Proof of Address", note: "Utility bill or bank statement", required: true },
  { doc: "Source of Funds", note: "For amounts over AED 1M", required: false },
  { doc: "Power of Attorney", note: "If buying remotely", required: false },
];

const FAQS = [
  {
    q: "Can I buy off-plan property in Dubai remotely?",
    a: "Yes. The entire purchase can be completed remotely via Power of Attorney. You can sign documents electronically, make payments via international transfer or crypto, and have a representative complete physical formalities."
  },
  {
    q: "Do I need a UAE bank account to buy property?",
    a: "No. International transfers are accepted for payments. However, for rental income collection, a UAE bank account is recommended. Many banks offer non-resident accounts for property owners."
  },
  {
    q: "What is the typical down payment for off-plan?",
    a: "Down payments range from 5-20% of property value depending on developer and project. Popular payment plans include 10/90, 20/80, 30/70, and even 1% monthly until handover."
  },
  {
    q: "How long does the entire purchase process take?",
    a: "From initial enquiry to SPA signing typically takes 2-3 weeks. DLD registration adds another 3-5 business days. Construction and handover timeline varies by project (typically 2-4 years)."
  },
  {
    q: "Can I sell my off-plan property before handover?",
    a: "Yes, this is called 'assignment' or 'flipping'. Most developers allow assignment after 30-40% payment, with NOC fee of AED 5,000-10,000. Market conditions affect resale value."
  },
  {
    q: "What protection do I have if developer delays?",
    a: "RERA regulations mandate compensation for delays beyond 12 months. Funds are held in escrow and refunded 100% if project is cancelled. Most SPAs include delay penalty clauses."
  },
];

const RELATED_LINKS = [
  { title: "Investment Guide", href: "/dubai-off-plan-investment-guide", description: "ROI strategies and analysis" },
  { title: "Understanding Payment Plans", href: "/dubai-off-plan-payment-plans", description: "80/20, post-handover options" },
  { title: "Best Projects 2025", href: "/best-off-plan-projects-dubai-2025", description: "Top opportunities this year" },
  { title: "Crypto Payments", href: "/dubai-off-plan-crypto-payments", description: "BTC, USDT, ETH accepted" },
  { title: "Escrow Protection", href: "/dubai-off-plan-escrow-accounts", description: "How your funds are protected" },
];

export default function OffPlanHowToBuy() {
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    document.title = "How to Buy Off-Plan Property in Dubai 2025 | Step-by-Step Guide";
  }, []);

  return (
    <>
      <PublicNav />
      <OffPlanStatsBar />
      <OffPlanBreadcrumb items={[
        { label: "Off-Plan Properties", href: "/dubai-off-plan-properties" },
        { label: "How to Buy" }
      ]} />
      <OffPlanSubNav activeHref="/how-to-buy-dubai-off-plan" />

      <main className="bg-background">
        {/* Hero */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Purchase Guide 2025</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              How to Buy Off-Plan Property in Dubai
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Your complete 7-step roadmap to purchasing off-plan property, from research 
              to handover, with full DLD protection and crypto payment options.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dubai-off-plan-properties">
                <Button size="lg" className="rounded-full" data-testid="button-view-projects">
                  <Building2 className="w-5 h-5 mr-2" />
                  Browse Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">7-Step Purchase Process</h2>
            <p className="text-muted-foreground mb-10 text-center">
              From initial research to receiving your keys
            </p>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
              
              <div className="space-y-8">
                {PURCHASE_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.step} className="relative flex gap-4 md:gap-6">
                      {/* Step number */}
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0 z-10">
                        {step.step}
                      </div>
                      
                      <Card className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                        
                        <ul className="space-y-2 mb-4">
                          {step.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="bg-muted/50 rounded-md p-3">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">Pro Tip:</span> {step.tip}
                          </p>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Documents Required */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Documents Required</h2>
            <p className="text-muted-foreground mb-8 text-center">
              What you need to complete your purchase
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {DOCUMENTS_REQUIRED.map((doc) => (
                <Card key={doc.doc} className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    doc.required ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <FileText className={`w-5 h-5 ${doc.required ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{doc.doc}</h3>
                      {doc.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.note}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Costs Breakdown */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Purchase Costs</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Additional costs beyond property price
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 text-center">
                <Banknote className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">4%</p>
                <p className="text-sm text-muted-foreground">DLD Registration Fee</p>
                <p className="text-xs text-muted-foreground mt-1">Of property value</p>
              </Card>
              <Card className="p-5 text-center">
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">AED 4,200</p>
                <p className="text-sm text-muted-foreground">Admin Fees</p>
                <p className="text-xs text-muted-foreground mt-1">DLD + Oqood</p>
              </Card>
              <Card className="p-5 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">2%</p>
                <p className="text-sm text-muted-foreground">Agent Commission</p>
                <p className="text-xs text-muted-foreground mt-1">If using agent</p>
              </Card>
              <Card className="p-5 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">0%</p>
                <p className="text-sm text-muted-foreground">Property Tax</p>
                <p className="text-xs text-muted-foreground mt-1">No annual tax</p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Common questions about the buying process
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
          title="Ready to Start Your Purchase?"
          subtitle="Our team will guide you through every step of the buying process"
          ctaText="Get Expert Guidance"
          onCtaClick={() => setWizardOpen(true)}
        />
      </main>
    </>
  );
}
