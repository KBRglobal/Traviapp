import { Link } from "wouter";
import { Bitcoin, ChevronRight, TrendingUp, Calendar, MapPin, Shield, CheckCircle, Quote, Wallet } from "lucide-react";
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

export default function CaseStudyCryptoBuyer() {
  useDocumentMeta({
    title: "Case Study: Buying Dubai Property with Bitcoin | Crypto Success Story",
    description: "How Michael purchased a AED 2.4M Business Bay apartment using USDT. Complete process, tax advantages, and timeline for buying Dubai property with cryptocurrency.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Case Studies", href: "/dubai-off-plan-properties" },
    { label: "Crypto Purchase Story" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                  <Bitcoin className="h-3 w-3 mr-1" />
                  Crypto Payment
                </Badge>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  AED 2.4M Purchase
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                How Michael Bought a Business Bay Apartment with USDT
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mb-6 max-w-3xl">
                German tech entrepreneur Michael K. used his cryptocurrency holdings to purchase 
                a 2-bedroom apartment in Business Bay for AED 2.4 million. The entire process 
                took just 3 weeks from decision to contract signing.
              </p>
              <div className="flex items-center gap-4 text-orange-100">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Business Bay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>Paid with USDT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Why Crypto for Dubai Property?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Michael had accumulated significant cryptocurrency holdings from his tech 
                  startup exit. Rather than convert to fiat (triggering capital gains in Germany), 
                  he sought jurisdictions where crypto-to-property transactions are legal and tax-efficient.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-500/10 rounded-md">
                    <Bitcoin className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="font-semibold">Tax Efficiency</div>
                    <div className="text-sm text-muted-foreground">No crypto gains tax in UAE</div>
                  </div>
                  <div className="text-center p-4 bg-orange-500/10 rounded-md">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="font-semibold">Legal Framework</div>
                    <div className="text-sm text-muted-foreground">VARA-regulated process</div>
                  </div>
                  <div className="text-center p-4 bg-orange-500/10 rounded-md">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="font-semibold">Asset Conversion</div>
                    <div className="text-sm text-muted-foreground">Volatile to stable asset</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Purchase Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-6 border-l-2 border-orange-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-orange-500" />
                  <h4 className="font-semibold">Week 1: Property Selection</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Worked with crypto-friendly broker to identify DAMAC projects accepting 
                    cryptocurrency. Chose a 2-BR in Damac Business Tower for AED 2.4M.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-orange-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-orange-500" />
                  <h4 className="font-semibold">Week 2: Payment Arrangement</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Developer's payment processor (Binance Pay partner) set up. Agreed on 
                    USDT payment with real-time AED conversion at market rate.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-orange-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-orange-500" />
                  <h4 className="font-semibold">Week 2-3: Documentation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    KYC/AML verification completed. Source of funds documentation prepared. 
                    SPA drafted with crypto payment terms.
                  </p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-semibold text-green-600">Week 3: Contract Signed</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Transferred 10% deposit (AED 240,000 equivalent) in USDT. Contract signed, 
                    Oqood registered. Monthly USDT payments scheduled for construction period.
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
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-orange-500 pl-4">
                  "I had significant USDT holdings and was looking for ways to diversify 
                  into real assets without triggering capital gains in Europe. Dubai's 
                  crypto-friendly regulations and the developer accepting USDT directly 
                  made the process surprisingly smooth. Within 3 weeks I owned property 
                  in one of the world's fastest-growing cities."
                </blockquote>
                <p className="mt-4 text-sm text-muted-foreground">- Michael K., Tech Entrepreneur, Germany</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crypto Purchase Advantages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">No capital gains trigger</span>
                      <p className="text-sm text-muted-foreground">Converting crypto to UAE property avoids European crypto taxes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Fast transaction settlement</span>
                      <p className="text-sm text-muted-foreground">Crypto transfers clear within minutes vs days for wire transfers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Lower transaction fees</span>
                      <p className="text-sm text-muted-foreground">USDT transfer fees are minimal vs international wire costs</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Asset diversification</span>
                      <p className="text-sm text-muted-foreground">Converted volatile crypto to stable real estate with rental income</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-orange-500/50">
              <CardHeader>
                <CardTitle className="text-lg">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-semibold">2-BR Apartment</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold">Business Bay</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-semibold">AED 2,400,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold text-orange-600">USDT</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Payment Plan</span>
                  <span className="font-semibold">60/40</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Process Time</span>
                  <span className="font-semibold">3 Weeks</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-semibold">DAMAC</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Buy with Cryptocurrency</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with brokers specializing in crypto property 
                  purchases in Dubai.
                </p>
                <Link href="https://thrivestate.ae">
                  <Button className="w-full" data-testid="button-crypto-consultation">
                    <Bitcoin className="mr-2 h-4 w-4" />
                    Crypto Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <OffPlanCTASection
          title="Buy Dubai Property with Crypto"
          subtitle="Discover crypto-friendly developers and projects accepting BTC, ETH, and USDT payments."
          ctaText="Explore Crypto Options"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Resources"
          links={[
            { href: "/off-plan-crypto-payments", title: "Crypto Payments Guide" },
            { href: "/off-plan-usdt", title: "USDT Payments" },
            { href: "/off-plan-damac", title: "DAMAC Properties" },
            { href: "/off-plan-business-bay", title: "Business Bay" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
