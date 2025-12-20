import { Link } from "wouter";
import { Shield, ChevronRight, FileText, Building, Lock, AlertTriangle, CheckCircle, Scale } from "lucide-react";
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

const protections = [
  {
    title: "Escrow Accounts",
    icon: Lock,
    description: "All off-plan payments go into regulated escrow accounts. Developers only receive funds when construction milestones are verified by DLD.",
    law: "Law No. 8 of 2007"
  },
  {
    title: "RERA Registration",
    icon: Building,
    description: "Every off-plan project must be registered with RERA. Developers need approval before selling, ensuring legitimacy.",
    law: "RERA Guidelines"
  },
  {
    title: "Oqood Registration",
    icon: FileText,
    description: "Your ownership is registered with DLD from purchase, providing legal proof before title deed issuance.",
    law: "DLD Requirement"
  },
  {
    title: "Developer Licensing",
    icon: Shield,
    description: "Developers must be licensed by RERA with proven track record. Financial stability checked before project approval.",
    law: "RERA Licensing"
  }
];

const dueDiligenceChecks = [
  "Verify developer RERA registration number",
  "Confirm project escrow account details",
  "Check developer's delivery track record",
  "Review SPA terms with legal advisor",
  "Verify Oqood registration with DLD",
  "Confirm all fees upfront (DLD, service charges)",
  "Check for any outstanding developer disputes",
  "Verify payment plan matches SPA terms"
];

const redFlags = [
  { flag: "Pressure to sign immediately", risk: "May hide unfavorable terms" },
  { flag: "Payments to personal accounts", risk: "Not escrow protected" },
  { flag: "No RERA registration number", risk: "Unregistered project" },
  { flag: "Unusually low prices", risk: "May be scam or failing project" },
  { flag: "Reluctance to provide SPA copy", risk: "Hidden terms" },
  { flag: "Unverified broker license", risk: "Unlicensed operator" }
];

export default function PillarLegalSecurity() {
  useDocumentMeta({
    title: "Dubai Off-Plan Legal & Security Guide 2026 | Buyer Protection",
    description: "Complete guide to Dubai off-plan buyer protections. Understand escrow accounts, RERA regulations, Oqood registration, and due diligence checklist. Invest safely.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Legal & Security Guide" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-blue-900 via-indigo-800 to-slate-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Tier 2 Pillar
                </Badge>
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                  Buyer Protection
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Dubai Off-Plan Legal & Security Guide
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl">
                Dubai has one of the world's most robust buyer protection frameworks for 
                off-plan property. Understand escrow accounts, RERA regulations, and due 
                diligence steps to invest with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-escrow">
                  <Button size="lg" data-testid="button-escrow-guide">
                    <Lock className="mr-2 h-4 w-4" />
                    Escrow Guide
                  </Button>
                </Link>
                <Link href="/glossary">
                  <Button size="lg" variant="outline" data-testid="button-legal-terms">
                    Legal Terms
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Buyer Protection Framework</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {protections.map((protection, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-md bg-primary/10">
                      <protection.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{protection.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{protection.description}</p>
                      <Badge variant="outline">{protection.law}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How Escrow Protects You</h2>
          <Card className="border-primary">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4 text-center mb-6">
                <div className="p-4 bg-muted/30 rounded-md">
                  <div className="text-2xl font-bold text-primary mb-1">1</div>
                  <p className="text-sm">You pay to escrow account</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-md">
                  <div className="text-2xl font-bold text-primary mb-1">2</div>
                  <p className="text-sm">DLD verifies construction</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-md">
                  <div className="text-2xl font-bold text-primary mb-1">3</div>
                  <p className="text-sm">Funds released to developer</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-md">
                  <div className="text-2xl font-bold text-primary mb-1">4</div>
                  <p className="text-sm">If developer fails, funds protected</p>
                </div>
              </div>
              <p className="text-muted-foreground text-center">
                Dubai Law No. 8 of 2007 mandates escrow for all off-plan sales. Your payments 
                are held in a regulated bank account and only released when construction 
                milestones are independently verified.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Due Diligence Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dueDiligenceChecks.map((check, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {check}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Red Flags to Watch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {redFlags.map((item, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-semibold text-destructive">{item.flag}</span>
                      <p className="text-muted-foreground">{item.risk}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Legal Documents</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Sale & Purchase Agreement (SPA)</h3>
                <p className="text-sm text-muted-foreground">
                  Legal contract defining property details, payment schedule, handover date, 
                  and buyer/seller obligations. Always review with lawyer.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Oqood Certificate</h3>
                <p className="text-sm text-muted-foreground">
                  DLD registration of off-plan purchase. Proves ownership during construction 
                  before title deed issuance.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Title Deed</h3>
                <p className="text-sm text-muted-foreground">
                  Official ownership document issued at handover. Required for resale, 
                  mortgage, or property transfer.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Regulatory Bodies</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Dubai Land Department (DLD)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Government authority overseeing all real estate transactions, title deed 
                    registration, and property ownership records.
                  </p>
                  <Badge variant="outline">www.dubailand.gov.ae</Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    RERA (Real Estate Regulatory Agency)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Regulatory body under DLD licensing developers, brokers, and overseeing 
                    off-plan project approvals.
                  </p>
                  <Badge variant="outline">rera.ae</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Invest with Confidence"
          subtitle="Connect with licensed consultants who can guide you through due diligence and ensure a secure purchase."
          ctaText="Get Legal Guidance"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Security Resources"
          links={[
            { href: "/off-plan-escrow", title: "Escrow Guide" },
            { href: "/how-to-buy-dubai-off-plan", title: "How to Buy" },
            { href: "/glossary", title: "Legal Glossary" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/off-plan-emaar", title: "Trusted Developer: Emaar" },
            { href: "/compare-emaar-vs-damac", title: "Developer Comparison" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
