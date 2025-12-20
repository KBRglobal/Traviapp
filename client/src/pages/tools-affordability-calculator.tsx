import { useState } from "react";
import { Link } from "wouter";
import { Calculator, ChevronRight, Wallet, TrendingUp, Home, DollarSign, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  OffPlanStatsBar, 
  OffPlanBreadcrumb, 
  OffPlanSubNav, 
  OffPlanCTASection, 
  RelatedLinks,
  TrustSignals 
} from "@/components/off-plan-shared";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const propertyOptions = [
  { name: "Studio - JVC", price: 420000, rental: 35000, location: "Jumeirah Village Circle" },
  { name: "1-BR - JVC", price: 500000, rental: 45000, location: "Jumeirah Village Circle" },
  { name: "1-BR - Business Bay", price: 1100000, rental: 75000, location: "Business Bay" },
  { name: "2-BR - Dubai Hills", price: 1800000, rental: 120000, location: "Dubai Hills Estate" },
  { name: "2-BR - Creek Harbour", price: 2200000, rental: 140000, location: "Dubai Creek Harbour" },
  { name: "3-BR Villa - Arabian Ranches", price: 3500000, rental: 200000, location: "Arabian Ranches III" },
];

export default function ToolsAffordabilityCalculator() {
  const [monthlySavings, setMonthlySavings] = useState(15000);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlyIncome, setMonthlyIncome] = useState(25000);
  const [paymentPlan, setPaymentPlan] = useState(60);

  useDocumentMeta({
    title: "Dubai Affordability Calculator | What Property Can I Afford 2026",
    description: "Find out what Dubai property you can afford. Input your savings and income to see matching off-plan options. Free calculator with real market prices.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Tools", href: "/dubai-off-plan-properties" },
    { label: "Affordability Calculator" }
  ];

  const formatAED = (value: number) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(value);
  };

  const calculateAffordability = () => {
    const constructionMonths = 36;
    const duringConstructionPercent = paymentPlan / 100;
    const maxDuringConstruction = monthlySavings * constructionMonths;
    const maxPropertyPrice = maxDuringConstruction / duringConstructionPercent;
    const handoverAmount = maxPropertyPrice * (1 - duringConstructionPercent);
    const canAffordHandover = currentSavings + (monthlySavings * constructionMonths) >= handoverAmount;
    
    return {
      maxPropertyPrice: Math.min(maxPropertyPrice, 5000000),
      monthlyPayment: monthlySavings,
      handoverNeeded: handoverAmount,
      canAffordHandover
    };
  };

  const affordability = calculateAffordability();

  const affordableProperties = propertyOptions.filter(p => p.price <= affordability.maxPropertyPrice);

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-200 border-violet-400/30">
                  <Calculator className="h-3 w-3 mr-1" />
                  Free Tool
                </Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                  Personalized Results
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                What Property Can You Afford?
              </h1>
              <p className="text-lg md:text-xl text-violet-100 mb-6 max-w-3xl">
                Enter your financial details to discover which Dubai off-plan properties 
                fit your budget. See matching projects with flexible payment plans that 
                work for your income level.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Your Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (AED)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="mt-1"
                  data-testid="input-monthly-income"
                />
              </div>

              <div>
                <Label>Monthly Savings for Property: {formatAED(monthlySavings)}</Label>
                <Slider
                  value={[monthlySavings]}
                  onValueChange={(value) => setMonthlySavings(value[0])}
                  min={5000}
                  max={50000}
                  step={1000}
                  className="mt-2"
                  data-testid="slider-monthly-savings"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>AED 5,000/mo</span>
                  <span>AED 50,000/mo</span>
                </div>
              </div>

              <div>
                <Label htmlFor="currentSavings">Current Savings (AED)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="mt-1"
                  data-testid="input-current-savings"
                />
              </div>

              <div>
                <Label>Payment Plan (% During Construction): {paymentPlan}%</Label>
                <Slider
                  value={[paymentPlan]}
                  onValueChange={(value) => setPaymentPlan(value[0])}
                  min={40}
                  max={80}
                  step={10}
                  className="mt-2"
                  data-testid="slider-payment-plan"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>40% (More post-handover)</span>
                  <span>80% (Less at handover)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Your Affordability Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 rounded-md bg-primary/10">
                <div className="text-sm text-muted-foreground mb-1">Maximum Property Price</div>
                <div className="text-4xl font-bold text-primary">{formatAED(affordability.maxPropertyPrice)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-muted/30 text-center">
                  <div className="text-sm text-muted-foreground">Monthly Payment</div>
                  <div className="text-xl font-bold">{formatAED(monthlySavings)}</div>
                  <div className="text-xs text-muted-foreground">During construction</div>
                </div>
                <div className="p-4 rounded-md bg-muted/30 text-center">
                  <div className="text-sm text-muted-foreground">At Handover</div>
                  <div className="text-xl font-bold">{formatAED(affordability.handoverNeeded)}</div>
                  <div className="text-xs text-muted-foreground">{100 - paymentPlan}% of price</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Affordable properties: {affordableProperties.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Payment: {formatAED(monthlySavings)}/mo x 36 months</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Income ratio: {((monthlySavings / monthlyIncome) * 100).toFixed(0)}% of income</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-md text-sm">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Based on 36-month construction period. Actual affordability may vary by project.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Properties Within Your Budget</h2>
          {affordableProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {affordableProperties.map((property, index) => {
                const monthlyPayment = (property.price * (paymentPlan / 100)) / 36;
                const handoverAmount = property.price * ((100 - paymentPlan) / 100);
                return (
                  <Card key={index} className="hover-elevate">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold">{property.name}</div>
                          <div className="text-sm text-muted-foreground">{property.location}</div>
                        </div>
                        <Badge variant="outline">{formatAED(property.price)}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monthly:</span>
                          <span className="font-semibold">{formatAED(monthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">At Handover:</span>
                          <span className="font-semibold">{formatAED(handoverAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Rental:</span>
                          <span className="font-semibold text-green-600">{formatAED(property.rental)}/yr</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Adjust Your Budget</h3>
                <p className="text-muted-foreground">
                  Increase monthly savings or consider post-handover plans to expand your options.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Budget-Friendly Tips</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <DollarSign className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Start in JVC</h3>
                <p className="text-sm text-muted-foreground">
                  Jumeirah Village Circle offers Dubai's most affordable entry from AED 420K 
                  with strong 7.5% rental yields.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Post-Handover Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Choose plans with 40-50% post-handover to use rental income to cover 
                  remaining payments after receiving keys.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Wallet className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">30% Income Rule</h3>
                <p className="text-sm text-muted-foreground">
                  Keep property payments under 30% of income for comfortable cash flow and 
                  financial flexibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Find Properties in Your Budget"
          subtitle="Connect with consultants who can show you projects that match your financial situation with the best payment plans."
          ctaText="Get Personalized Options"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Resources"
          links={[
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/tools-payment-calculator", title: "Payment Calculator" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans Guide" },
            { href: "/off-plan-jvc", title: "JVC Properties" },
            { href: "/compare-jvc-vs-dubai-south", title: "JVC vs Dubai South" },
            { href: "/off-plan-golden-visa", title: "Golden Visa" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
