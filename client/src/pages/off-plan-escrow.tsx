import { Link } from "wouter";
import { Shield, ChevronRight, Lock, Building, CheckCircle, FileText, Scale, AlertTriangle } from "lucide-react";
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

const escrowBenefits = [
  { title: "Fund Protection", description: "Your money held in regulated bank account until construction milestones", icon: Lock },
  { title: "Milestone Verification", description: "Independent verification before funds released to developer", icon: CheckCircle },
  { title: "Legal Framework", description: "Protected under UAE Law No. 8 of 2007", icon: Scale },
  { title: "Refund Rights", description: "Clear process for refunds if project cancelled", icon: Shield }
];

const howEscrowWorks = [
  { step: 1, title: "Payment to Escrow", description: "Buyer pays into developer's designated escrow account at registered bank" },
  { step: 2, title: "RERA Oversight", description: "Dubai Land Department's RERA monitors escrow account and construction progress" },
  { step: 3, title: "Milestone Verification", description: "Independent engineers verify construction completion of each phase" },
  { step: 4, title: "Fund Release", description: "Upon verification, funds released to developer for completed work only" },
  { step: 5, title: "Final Handover", description: "Remaining funds released upon project completion and handover" }
];

const buyerProtections = [
  { protection: "Registered Project", description: "All off-plan projects must be registered with RERA before sales begin" },
  { protection: "Construction Progress", description: "Developers can only access funds matching verified construction progress" },
  { protection: "Bank Guarantee", description: "Developer must provide bank guarantee for project completion" },
  { protection: "Cancellation Rights", description: "Clear refund procedures if developer fails to complete project" },
  { protection: "Title Deed Escrow", description: "Some transactions use escrow for title deed transfer protection" }
];

export default function OffPlanEscrow() {
  useDocumentMeta({
    title: "Dubai Off-Plan Escrow Protection | RERA Buyer Safety 2026",
    description: "Understand Dubai's off-plan escrow protection system. Your funds held securely until construction milestones verified. RERA-regulated buyer protection under UAE Law No. 8.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Buyer Protection", href: "/how-to-buy-dubai-off-plan" },
    { label: "Escrow" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-escrow" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-slate-500/20 text-slate-200 border-slate-400/30">
                  <Shield className="h-3 w-3 mr-1" />
                  RERA Regulated
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                  Buyer Protection
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Off-Plan Escrow Protection
              </h1>
              <p className="text-lg md:text-xl text-slate-100 mb-6 max-w-3xl">
                Dubai's escrow system ensures your off-plan payments are protected by law. 
                Your funds are held in regulated bank accounts and only released to developers 
                upon verification of construction progress. Comprehensive buyer protection under 
                UAE Law No. 8 of 2007.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-verify-escrow">
                  Verify Escrow Status
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/how-to-buy-dubai-off-plan">
                  <Button size="lg" variant="outline" data-testid="button-how-to-buy">
                    How to Buy Guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-4 mb-12">
          {escrowBenefits.map((benefit, index) => (
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
          <h2 className="text-2xl font-bold mb-6">How Escrow Works</h2>
          <div className="space-y-4">
            {howEscrowWorks.map((step, index) => (
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
          <h2 className="text-2xl font-bold mb-6">Buyer Protections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyerProtections.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">{item.protection}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Legal Framework</h2>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    UAE Law No. 8 of 2007
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    This law governs escrow accounts for real estate development in Dubai, 
                    establishing mandatory protections for off-plan buyers.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Mandatory escrow for all off-plan sales
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Regulated by Real Estate Regulatory Agency (RERA)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Funds held at approved financial institutions
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    RERA Registration
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    All off-plan projects in Dubai must be registered with RERA, which 
                    maintains public records of project status and escrow accounts.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Verify project registration on DLD portal
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Check escrow account status online
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      File complaints with RERA if issues arise
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">What to Verify Before Buying</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-md border">
                  <h4 className="font-semibold mb-2">Project Registration</h4>
                  <p className="text-sm text-muted-foreground">
                    Confirm the project is registered with RERA on the Dubai Land Department website.
                  </p>
                </div>
                <div className="p-4 rounded-md border">
                  <h4 className="font-semibold mb-2">Escrow Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Verify the escrow account number and ensure payments go directly to this account.
                  </p>
                </div>
                <div className="p-4 rounded-md border">
                  <h4 className="font-semibold mb-2">Developer License</h4>
                  <p className="text-sm text-muted-foreground">
                    Check that the developer holds a valid license from the Dubai Land Department.
                  </p>
                </div>
                <div className="p-4 rounded-md border">
                  <h4 className="font-semibold mb-2">Sales Contract</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure the SPA (Sales and Purchase Agreement) is registered with RERA.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Important Warning</h3>
                  <p className="text-muted-foreground">
                    Never pay directly to a developer's company account or to an agent's personal account. 
                    All payments for off-plan properties must go to the registered escrow account. 
                    If asked to pay elsewhere, this is a red flag and you should verify with RERA immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Buy with Confidence"
          subtitle="Work with verified consultants who guide you through escrow-protected purchases. Full transparency on fund protection and buyer rights."
          ctaText="Get Expert Guidance"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Buyer Guides"
          links={[
            { href: "/how-to-buy-dubai-off-plan", title: "How to Buy" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans" },
            { href: "/off-plan-post-handover", title: "Post-Handover Plans" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/off-plan-vs-ready", title: "Off-Plan vs Ready" },
            { href: "/off-plan-golden-visa", title: "Golden Visa" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
