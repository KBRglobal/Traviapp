import { Link } from "wouter";
import { ArrowLeft, ArrowRightLeft, RefreshCw, TrendingUp, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const currencies = [
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
];

const exchangeRates: Record<string, number> = {
  AED: 1,
  USD: 0.2723,
  EUR: 0.2519,
  GBP: 0.2165,
  ILS: 1.0000,
  SAR: 1.0211,
  INR: 22.78,
  CNY: 1.9782,
  RUB: 27.15,
};

const popularPairs = [
  { from: "AED", to: "USD", amount: 100 },
  { from: "AED", to: "EUR", amount: 100 },
  { from: "AED", to: "ILS", amount: 100 },
  { from: "USD", to: "AED", amount: 100 },
];

export default function PublicCurrency() {
  const [fromCurrency, setFromCurrency] = useState("AED");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState<string>("100");
  const [result, setResult] = useState<number>(0);
  const [lastUpdated] = useState(new Date().toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }));

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const converted = (numAmount / fromRate) * toRate;
    setResult(converted);
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getRate = (from: string, to: string) => {
    return (exchangeRates[to] / exchangeRates[from]).toFixed(4);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
  };

  return (
    <div className="bg-background min-h-screen">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors">Attractions</Link>
              <Link href="/tools/currency" className="text-primary font-medium">Currency</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors">Articles</Link>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-[#0d9488] via-[#14b8a6] to-[#5eead4] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTAgMzBoNjAiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0zMCAwdjYwIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="absolute top-5 right-10 w-36 h-36 bg-[#a7f3d0] rounded-full blur-3xl opacity-25" />
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#065f46] rounded-full blur-3xl opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a7f3d0] to-[#14b8a6] flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-[#065f46]" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">Currency Converter</h1>
              <p className="text-white/90">Convert UAE Dirham to popular currencies</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 sm:p-8 border-0 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-12 px-4 pr-20 text-lg font-semibold rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter amount"
                    data-testid="input-amount"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="w-20 h-8 text-sm border-0 bg-muted" data-testid="select-from-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-center py-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapCurrencies}
                  className="rounded-full"
                  data-testid="button-swap"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Converted To</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatNumber(result)}
                    readOnly
                    className="w-full h-12 px-4 pr-20 text-lg font-semibold rounded-lg border bg-muted cursor-not-allowed"
                    data-testid="input-result"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="w-20 h-8 text-sm border-0 bg-background" data-testid="select-to-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    1 {fromCurrency} = {getRate(fromCurrency, toCurrency)} {toCurrency}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    1 {toCurrency} = {getRate(toCurrency, fromCurrency)} {fromCurrency}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RefreshCw className="w-3 h-3" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <h2 className="font-heading text-xl font-semibold mb-4">Popular Conversions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularPairs.map((pair, index) => {
                const rate = (exchangeRates[pair.to] / exchangeRates[pair.from]);
                const converted = pair.amount * rate;
                return (
                  <Card 
                    key={index} 
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setFromCurrency(pair.from);
                      setToCurrency(pair.to);
                      setAmount(pair.amount.toString());
                    }}
                    data-testid={`card-conversion-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{getCurrencySymbol(pair.from)}{pair.amount} {pair.from}</p>
                        <p className="text-sm text-muted-foreground">to {pair.to}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{getCurrencySymbol(pair.to)}{formatNumber(converted)}</p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          <span>1:{rate.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-heading text-xl font-semibold mb-4">All Exchange Rates (AED Base)</h2>
            <Card className="divide-y">
              {currencies.filter(c => c.code !== "AED").map((currency) => {
                const rate = exchangeRates[currency.code];
                return (
                  <div 
                    key={currency.code} 
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setFromCurrency("AED");
                      setToCurrency(currency.code);
                    }}
                    data-testid={`rate-${currency.code}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {currency.code}
                      </div>
                      <div>
                        <p className="font-medium">{currency.name}</p>
                        <p className="text-sm text-muted-foreground">{currency.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{currency.symbol}{rate.toFixed(4)}</p>
                      <p className="text-xs text-muted-foreground">per 1 AED</p>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          <Card className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> Exchange rates are for informational purposes only and may differ from actual rates at banks or exchange offices. Always verify current rates before making transactions.
            </p>
          </Card>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-gradient-to-r from-teal-500 to-cyan-500 border-0 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-2">Plan Your Dubai Trip</h3>
                <p className="text-white/90">Calculate costs, find events, and book your travel</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/tools/budget">
                  <Button className="bg-white text-teal-600 hover:bg-white/90" data-testid="link-budget">
                    Budget Calculator
                  </Button>
                </Link>
                <Link href="/tools/events">
                  <Button variant="outline" className="border-white/50 text-white hover:bg-white/10" data-testid="link-events">
                    Events Calendar
                  </Button>
                </Link>
                <Link href="/tools/plan">
                  <Button variant="outline" className="border-white/50 text-white hover:bg-white/10" data-testid="link-plan">
                    Travel Planning
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo variant="primary" height={28} />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-foreground transition-colors">Attractions</Link>
              <Link href="/tools/currency" className="hover:text-foreground transition-colors">Currency</Link>
              <Link href="/articles" className="hover:text-foreground transition-colors">Articles</Link>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <span>2024 Travi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
