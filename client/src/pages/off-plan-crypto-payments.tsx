import { Link } from "wouter";
import { Bitcoin, ChevronRight, Clock, Shield, Zap, Globe, CheckCircle, ArrowRight, Wallet } from "lucide-react";
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

const supportedCryptos = [
  { name: "Bitcoin (BTC)", icon: "BTC", description: "World's leading cryptocurrency", processing: "24-48 hours" },
  { name: "Tether (USDT)", icon: "USDT", description: "Stablecoin pegged to USD", processing: "Same day" },
  { name: "Ethereum (ETH)", icon: "ETH", description: "Smart contract platform", processing: "24-48 hours" },
  { name: "USD Coin (USDC)", icon: "USDC", description: "Regulated stablecoin", processing: "Same day" }
];

const paymentSteps = [
  { step: 1, title: "Select Property", description: "Choose from 500+ off-plan projects accepting crypto" },
  { step: 2, title: "Reserve Unit", description: "Secure your unit with initial crypto deposit" },
  { step: 3, title: "VARA Conversion", description: "Crypto converted to AED via licensed gateway" },
  { step: 4, title: "Complete Transaction", description: "Developer receives AED, you receive title deed" }
];

const benefits = [
  { title: "VARA Licensed", description: "Fully regulated by Dubai's Virtual Assets Regulatory Authority", icon: Shield },
  { title: "Instant Conversion", description: "Real-time crypto to AED conversion at market rates", icon: Zap },
  { title: "Global Access", description: "Purchase Dubai property from anywhere in the world", icon: Globe },
  { title: "Fast Processing", description: "Complete transactions in 24-48 hours vs weeks for wire transfers", icon: Clock }
];

export default function OffPlanCryptoPayments() {
  useDocumentMeta({
    title: "Buy Dubai Property with Crypto | BTC, ETH, USDT Accepted 2025",
    description: "Purchase Dubai off-plan properties using Bitcoin, Ethereum, and USDT. VARA-licensed crypto gateway with instant AED conversion. Secure, regulated, and fast property transactions.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Payment Methods", href: "/dubai-off-plan-payment-plans" },
    { label: "Crypto Payments" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/off-plan-crypto-payments" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                  <Bitcoin className="h-3 w-3 mr-1" />
                  VARA Licensed
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                  Instant Conversion
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Buy Dubai Property with Cryptocurrency
              </h1>
              <p className="text-lg md:text-xl text-amber-100 mb-6 max-w-3xl">
                Purchase off-plan properties in Dubai using Bitcoin, Ethereum, and USDT through 
                VARA-licensed payment gateways. Enjoy instant AED conversion, regulatory compliance, 
                and secure transactions for your real estate investment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-start-crypto-purchase">
                  Start Crypto Purchase
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/off-plan-usdt">
                  <Button size="lg" variant="outline" data-testid="button-usdt-guide">
                    USDT Payment Guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-4 mb-12">
          {benefits.map((benefit, index) => (
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
          <h2 className="text-2xl font-bold mb-6">Supported Cryptocurrencies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportedCryptos.map((crypto, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{crypto.name}</div>
                      <Badge variant="outline" className="text-xs">{crypto.icon}</Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{crypto.description}</div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Processing: </span>
                    <span className="font-medium">{crypto.processing}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How Crypto Payments Work</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {paymentSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  {index < paymentSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block absolute right-0 top-2" />
                  )}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">VARA Regulatory Framework</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">What is VARA?</h3>
                  <p className="text-muted-foreground mb-4">
                    The Virtual Assets Regulatory Authority (VARA) is Dubai's dedicated regulator for 
                    cryptocurrency and virtual asset activities. Established in 2022, VARA provides 
                    comprehensive oversight for crypto transactions in real estate.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Full regulatory compliance for crypto-to-fiat conversions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      AML/KYC requirements protect all parties
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Licensed payment processors ensure secure transactions
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Protection for Buyers</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Transaction records maintained for legal clarity
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Market-rate conversions with transparent fees
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Escrow protection during property transfer
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      Full audit trail for tax documentation
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is crypto payment legal in Dubai?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. Dubai has established VARA to regulate crypto transactions, making it one of 
                  the most crypto-friendly jurisdictions globally. Property purchases using crypto 
                  are fully legal when processed through licensed gateways.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What exchange rate is used?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real-time market rates from major exchanges are used at the time of conversion. 
                  The rate is locked once you initiate the transaction, protecting you from 
                  volatility during processing.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are there additional fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Crypto conversion typically carries a 1-2% processing fee, often comparable to 
                  or lower than international wire transfer fees. All fees are disclosed before 
                  transaction confirmation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I pay the full amount in crypto?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. You can pay the entire property price in cryptocurrency, including the 
                  initial deposit, milestone payments, and final handover amount. Mixed payments 
                  (crypto + fiat) are also accepted.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Start Your Crypto Property Purchase"
          subtitle="Connect with certified consultants who specialize in cryptocurrency property transactions. VARA-compliant processing for BTC, ETH, and USDT."
          ctaText="Get Crypto Consultation"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Payment Guides"
          links={[
            { href: "/off-plan-usdt", title: "USDT Payment Guide" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plan Options" },
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
