import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Calculator, ChevronRight, ArrowRightLeft, RefreshCw, DollarSign, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  OffPlanStatsBar, 
  OffPlanBreadcrumb, 
  OffPlanSubNav, 
  OffPlanCTASection, 
  RelatedLinks,
  TrustSignals 
} from "@/components/off-plan-shared";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 0.2723 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.2510 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.2155 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 22.73 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", rate: 75.81 },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", rate: 25.15 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 1.97 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 1.02 },
  { code: "BTC", name: "Bitcoin", symbol: "₿", rate: 0.0000064 },
  { code: "USDT", name: "Tether (USDT)", symbol: "₮", rate: 0.2723 },
  { code: "ETH", name: "Ethereum", symbol: "Ξ", rate: 0.000078 }
];

export default function ToolsCurrencyConverter() {
  const [aedAmount, setAedAmount] = useState(1000000);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  
  useDocumentMeta({
    title: "AED Currency Converter | Dubai Property Investment Tool 2026",
    description: "Convert AED to USD, EUR, GBP, INR, BTC, USDT and more. Free currency converter for Dubai property investment. Updated exchange rates.",
    ogType: "website"
  });

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  
  const convertedAmount = useMemo(() => {
    if (!selectedCurrencyData) return 0;
    return aedAmount * selectedCurrencyData.rate;
  }, [aedAmount, selectedCurrencyData]);

  const formatCurrency = (amount: number, code: string) => {
    if (code === "BTC" || code === "ETH") {
      return amount.toFixed(6);
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Tools", href: "/dubai-off-plan-properties" },
    { label: "Currency Converter" }
  ];

  const quickAmounts = [500000, 1000000, 2000000, 5000000];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                  <Calculator className="h-3 w-3 mr-1" />
                  Free Tool
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  Live Rates
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                AED Currency Converter
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-6 max-w-3xl">
                Convert Dubai property prices from AED to your local currency or cryptocurrency. 
                Supports USD, EUR, GBP, INR, BTC, USDT, ETH and more.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Currency Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="aed-amount">Amount in AED</Label>
                    <Input
                      id="aed-amount"
                      type="number"
                      value={aedAmount}
                      onChange={(e) => setAedAmount(Number(e.target.value))}
                      className="text-lg"
                      data-testid="input-aed-amount"
                    />
                    <div className="flex flex-wrap gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setAedAmount(amount)}
                          data-testid={`button-quick-${amount}`}
                        >
                          {(amount / 1000000).toFixed(1)}M
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="currency-select">Convert To</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger id="currency-select" data-testid="select-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-md">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      AED {aedAmount.toLocaleString()} equals
                    </p>
                    <p className="text-4xl font-bold text-primary" data-testid="text-result">
                      {selectedCurrencyData?.symbol} {formatCurrency(convertedAmount, selectedCurrency)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedCurrencyData?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  <span>Rates are indicative. Always confirm with your bank/exchange.</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Property Prices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "JVC Studio", aed: 420000 },
                  { label: "JVC 1-BR", aed: 500000 },
                  { label: "Marina 1-BR", aed: 1400000 },
                  { label: "Golden Visa Min", aed: 2000000 },
                  { label: "Dubai Hills 3-BR", aed: 2800000 }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="text-right">
                      <div className="font-semibold">AED {item.aed.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedCurrencyData?.symbol} {formatCurrency(item.aed * (selectedCurrencyData?.rate || 0), selectedCurrency)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-green-500/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Bitcoin className="h-5 w-5 text-orange-500" />
                  <h4 className="font-semibold">Crypto Payments</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Dubai supports BTC, USDT, and ETH for property purchases through 
                  regulated channels.
                </p>
                <Link href="/off-plan-crypto-payments">
                  <Button className="w-full" variant="outline" data-testid="button-crypto-guide">
                    Crypto Payment Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Conversion Rates</h2>
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Currency</th>
                    <th className="text-left py-3 px-4 font-semibold">Code</th>
                    <th className="text-right py-3 px-4 font-semibold">1 AED =</th>
                    <th className="text-right py-3 px-4 font-semibold">AED 1M =</th>
                  </tr>
                </thead>
                <tbody>
                  {currencies.map((currency) => (
                    <tr key={currency.code} className="border-b last:border-0">
                      <td className="py-3 px-4">{currency.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{currency.code}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {currency.symbol} {formatCurrency(currency.rate, currency.code)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {currency.symbol} {formatCurrency(1000000 * currency.rate, currency.code)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <OffPlanCTASection
          title="Ready to Invest?"
          subtitle="Connect with consultants who can guide you through payment options in your preferred currency."
          ctaText="Get Investment Guidance"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Tools"
          links={[
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/tools-payment-calculator", title: "Payment Calculator" },
            { href: "/tools-affordability-calculator", title: "Affordability Calculator" },
            { href: "/compare-crypto-vs-bank-transfer", title: "Crypto vs Bank" },
            { href: "/off-plan-crypto-payments", title: "Crypto Payments" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
