import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, Bitcoin, Building2, Clock, Shield, DollarSign } from "lucide-react";
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

const comparisonTable = [
  { factor: "Transfer Speed", crypto: "Minutes", bank: "3-5 days", winner: "crypto" },
  { factor: "Transaction Fees", crypto: "0.1-1%", bank: "2-4%", winner: "crypto" },
  { factor: "Developer Acceptance", crypto: "Growing", bank: "Universal", winner: "bank" },
  { factor: "Documentation", crypto: "KYC Required", bank: "Standard", winner: "tie" },
  { factor: "Currency Risk", crypto: "Volatile (unless stablecoin)", bank: "Stable", winner: "bank" },
  { factor: "Tax Implications", crypto: "Varies by country", bank: "Clear", winner: "bank" },
  { factor: "Privacy", crypto: "Higher", bank: "Full reporting", winner: "crypto" },
  { factor: "Ease of Use", crypto: "Technical", bank: "Familiar", winner: "bank" },
  { factor: "Weekend/Holiday", crypto: "24/7", bank: "Business days only", winner: "crypto" },
  { factor: "Large Transfers", crypto: "No limits", bank: "May require approval", winner: "crypto" },
];

export default function CompareCryptoVsBankTransfer() {
  useDocumentMeta({
    title: "Crypto vs Bank Transfer for Dubai Property | Payment Comparison 2025",
    description: "Compare cryptocurrency and bank transfer for Dubai property purchases. Crypto offers speed and lower fees. Bank transfers provide stability. See full comparison.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "Crypto vs Bank Transfer" }
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
                  <Scale className="h-3 w-3 mr-1" />
                  Payment Comparison
                </Badge>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  2025 Guide
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Crypto vs Bank Transfer for Dubai Property
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mb-6 max-w-3xl">
                Dubai leads in crypto adoption for real estate, but traditional bank transfers 
                remain the standard. Compare speed, fees, acceptance, and implications to 
                choose the best payment method for your property purchase.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-crypto-payments">
                  <Button size="lg" data-testid="button-crypto-guide">
                    <Bitcoin className="mr-2 h-4 w-4" />
                    Crypto Guide
                  </Button>
                </Link>
                <Link href="/dubai-off-plan-payment-plans">
                  <Button size="lg" variant="outline" data-testid="button-payment-plans">
                    Payment Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-orange-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bitcoin className="h-5 w-5 text-orange-600" />
                  Cryptocurrency Payment
                </CardTitle>
                <p className="text-sm text-muted-foreground">BTC, ETH, USDT accepted by select developers</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-orange-500/10">
                    <Clock className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                    <div className="text-sm font-semibold">Minutes</div>
                    <div className="text-xs text-muted-foreground">Transfer Time</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-orange-500/10">
                    <DollarSign className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                    <div className="text-sm font-semibold">0.1-1%</div>
                    <div className="text-xs text-muted-foreground">Transaction Fee</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Instant settlement, no banking delays
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Lower transaction costs
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    24/7 availability
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    VARA regulated in Dubai
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Bank Transfer (SWIFT)
                </CardTitle>
                <p className="text-sm text-muted-foreground">Traditional wire transfer accepted universally</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-blue-500/10">
                    <Clock className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-semibold">3-5 Days</div>
                    <div className="text-xs text-muted-foreground">Transfer Time</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-blue-500/10">
                    <DollarSign className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-semibold">2-4%</div>
                    <div className="text-xs text-muted-foreground">Transaction Fee</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Accepted by all developers
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Stable currency, no volatility
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Familiar process for most buyers
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Clear documentation trail
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Head-to-Head Comparison</h2>
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Factor</th>
                    <th className="text-left py-3 px-4 font-semibold bg-orange-500/5">Crypto</th>
                    <th className="text-left py-3 px-4 font-semibold bg-blue-500/5">Bank Transfer</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'crypto' ? 'bg-green-500/10' : 'bg-orange-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'crypto' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.crypto}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'bank' ? 'bg-green-500/10' : 'bg-blue-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'bank' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.bank}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'crypto' ? 'default' : row.winner === 'bank' ? 'secondary' : 'outline'}>
                          {row.winner === 'crypto' ? 'Crypto' : row.winner === 'bank' ? 'Bank' : 'Tie'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Best Choice By Situation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-orange-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Crypto If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Hold significant crypto assets
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want to avoid capital gains in home country
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Need fast transaction settlement
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer lower transaction fees
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Bank Transfer If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want maximum developer options
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer familiar payment process
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Need clear documentation for records
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Hold funds in fiat currency
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Get Payment Method Guidance"
          subtitle="Connect with consultants who can advise on the best payment approach for your situation and find crypto-friendly developers."
          ctaText="Get Expert Advice"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Payment Resources"
          links={[
            { href: "/off-plan-crypto-payments", title: "Crypto Payments Guide" },
            { href: "/off-plan-usdt", title: "USDT Payments" },
            { href: "/case-study-crypto-buyer", title: "Crypto Buyer Story" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans" },
            { href: "/tools-payment-calculator", title: "Payment Calculator" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
