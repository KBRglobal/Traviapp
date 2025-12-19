import { Link } from "wouter";
import { DollarSign, ChevronRight, Clock, Shield, Zap, CheckCircle, ArrowRight, Wallet, TrendingUp } from "lucide-react";
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

const usdtAdvantages = [
  { title: "Price Stability", description: "1:1 USD peg eliminates crypto volatility risk", icon: TrendingUp },
  { title: "Same-Day Processing", description: "Fastest crypto payment option available", icon: Clock },
  { title: "Low Fees", description: "Typically 0.5-1% conversion to AED", icon: DollarSign },
  { title: "High Liquidity", description: "Largest stablecoin by market cap", icon: Zap }
];

const networkOptions = [
  { network: "TRC-20 (Tron)", speed: "1-5 minutes", fee: "~$1", recommended: true },
  { network: "ERC-20 (Ethereum)", speed: "5-15 minutes", fee: "$5-50", recommended: false },
  { network: "BEP-20 (BSC)", speed: "1-5 minutes", fee: "~$0.20", recommended: true }
];

const paymentSteps = [
  { step: 1, title: "Property Selection", description: "Choose your off-plan unit and receive payment details" },
  { step: 2, title: "Wallet Verification", description: "Complete KYC and verify your USDT wallet source" },
  { step: 3, title: "USDT Transfer", description: "Send USDT to the designated escrow wallet address" },
  { step: 4, title: "Instant Conversion", description: "USDT converted to AED at locked exchange rate" },
  { step: 5, title: "Transaction Complete", description: "Developer receives AED, purchase confirmed" }
];

export default function OffPlanUSDT() {
  useDocumentMeta({
    title: "Buy Dubai Property with USDT | Tether Payment Guide 2025",
    description: "Purchase Dubai off-plan properties using USDT (Tether) stablecoin. Same-day processing, 1:1 USD peg stability, and lowest conversion fees. Complete USDT payment guide.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Payment Methods", href: "/dubai-off-plan-payment-plans" },
    { label: "USDT Payments" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-usdt" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Stablecoin
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  Same-Day Processing
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Buy Dubai Property with USDT
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-6 max-w-3xl">
                USDT (Tether) is the preferred cryptocurrency for Dubai property purchases. 
                With 1:1 USD stability, same-day processing, and minimal conversion fees, 
                USDT offers the smoothest path from crypto to real estate ownership.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-start-usdt-purchase">
                  Pay with USDT
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/off-plan-crypto-payments">
                  <Button size="lg" variant="outline" data-testid="button-crypto-guide">
                    All Crypto Options
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-4 mb-12">
          {usdtAdvantages.map((advantage, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <advantage.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold mb-1">{advantage.title}</div>
                <div className="text-sm text-muted-foreground">{advantage.description}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why USDT for Property?</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Stability Advantage</h3>
                  <p className="text-muted-foreground mb-4">
                    Unlike Bitcoin or Ethereum, USDT maintains a stable 1:1 peg to the US Dollar. 
                    This means the value of your payment doesn't fluctuate between sending and 
                    conversion, providing predictable transaction amounts.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      No volatility risk during transaction processing
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Exact payment amounts known in advance
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Easier for payment plan calculations
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Speed Advantage</h3>
                  <p className="text-muted-foreground mb-4">
                    USDT transactions on TRC-20 or BEP-20 networks confirm within minutes and 
                    can be converted to AED the same day. Compare this to international wire 
                    transfers that can take 3-5 business days.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Same-day conversion to AED
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Transaction confirmation in minutes
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      No bank holidays or processing delays
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">USDT Network Comparison</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {networkOptions.map((network, index) => (
              <Card key={index} className={network.recommended ? "border-primary" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-semibold">{network.network}</div>
                    {network.recommended && (
                      <Badge variant="default">Recommended</Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmation:</span>
                      <span>{network.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network Fee:</span>
                      <span>{network.fee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            We recommend TRC-20 or BEP-20 for lowest fees and fastest processing. Always confirm 
            the network with your consultant before sending.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">USDT Payment Process</h2>
          <div className="space-y-4">
            {paymentSteps.map((step, index) => (
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
          <h2 className="text-2xl font-bold mb-6">USDT Payment FAQs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is the minimum USDT payment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Most developers accept USDT payments starting from the initial deposit amount, 
                  typically 10-20% of the property value. There's no maximum limit for USDT transactions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do I need to provide source of funds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, AML regulations require proof of USDT source. This can include exchange 
                  statements, wallet history, or documentation of how you acquired the USDT.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if USDT depegs from USD?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The conversion rate is locked at the time of transaction initiation. Any 
                  temporary depeg events don't affect your locked rate once the transaction 
                  is in progress.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I mix USDT with other payments?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can pay some installments in USDT and others via bank transfer. 
                  Many buyers use USDT for the initial deposit and fiat for subsequent payments.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Pay for Dubai Property with USDT"
          subtitle="Connect with consultants specializing in USDT property transactions. Same-day processing with VARA-compliant conversion."
          ctaText="Start USDT Purchase"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Payment Guides"
          links={[
            { href: "/off-plan-crypto-payments", title: "All Crypto Payments" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans" },
            { href: "/off-plan-escrow", title: "Escrow Protection" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/how-to-buy-dubai-off-plan", title: "How to Buy" },
            { href: "/off-plan-golden-visa", title: "Golden Visa" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
