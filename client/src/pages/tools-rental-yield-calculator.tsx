import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Calculator, ChevronRight, TrendingUp, DollarSign, Percent, Home } from "lucide-react";
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

export default function ToolsRentalYieldCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(1000000);
  const [annualRent, setAnnualRent] = useState(70000);
  const [serviceCharges, setServiceCharges] = useState(15000);
  const [maintenanceCost, setMaintenanceCost] = useState(5000);
  const [vacancyRate, setVacancyRate] = useState(5);
  
  useDocumentMeta({
    title: "Rental Yield Calculator Dubai 2025 | Gross & Net Yield Tool",
    description: "Calculate gross and net rental yields for Dubai property. Factor in service charges, maintenance, and vacancy. Free calculator with Dubai market benchmarks.",
    ogType: "website"
  });

  const calculations = useMemo(() => {
    const grossYield = (annualRent / propertyPrice) * 100;
    
    const vacancyLoss = annualRent * (vacancyRate / 100);
    const effectiveRent = annualRent - vacancyLoss;
    const totalExpenses = serviceCharges + maintenanceCost;
    const netIncome = effectiveRent - totalExpenses;
    const netYield = (netIncome / propertyPrice) * 100;
    
    const monthlyRent = annualRent / 12;
    const monthlyNetIncome = netIncome / 12;
    const yearsToBreakeven = propertyPrice / netIncome;
    
    return {
      grossYield,
      netYield,
      netIncome,
      monthlyRent,
      monthlyNetIncome,
      yearsToBreakeven,
      vacancyLoss,
      effectiveRent,
      totalExpenses
    };
  }, [propertyPrice, annualRent, serviceCharges, maintenanceCost, vacancyRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Tools", href: "/dubai-off-plan-properties" },
    { label: "Rental Yield Calculator" }
  ];

  const yieldBenchmarks = [
    { location: "JVC", yield: "7-8%" },
    { location: "Dubai South", yield: "6-7%" },
    { location: "Business Bay", yield: "5-6%" },
    { location: "Marina", yield: "5-6%" },
    { location: "Downtown", yield: "4-5%" },
    { location: "Palm Jumeirah", yield: "4-5%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                  <Calculator className="h-3 w-3 mr-1" />
                  Free Tool
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                  Net & Gross Yields
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Rental Yield Calculator
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-6 max-w-3xl">
                Calculate both gross and net rental yields for Dubai properties. Factor in 
                service charges, maintenance costs, and vacancy rates for accurate projections.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Yield Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Property Price: {formatCurrency(propertyPrice)}</Label>
                  <Slider
                    min={300000}
                    max={10000000}
                    step={50000}
                    value={[propertyPrice]}
                    onValueChange={(value) => setPropertyPrice(value[0])}
                    data-testid="slider-property-price"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>AED 300K</span>
                    <span>AED 10M</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Annual Rent: {formatCurrency(annualRent)}</Label>
                  <Slider
                    min={20000}
                    max={500000}
                    step={5000}
                    value={[annualRent]}
                    onValueChange={(value) => setAnnualRent(value[0])}
                    data-testid="slider-annual-rent"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>AED 20K</span>
                    <span>AED 500K</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-charges">Service Charges (Annual)</Label>
                    <Input
                      id="service-charges"
                      type="number"
                      value={serviceCharges}
                      onChange={(e) => setServiceCharges(Number(e.target.value))}
                      data-testid="input-service-charges"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">Maintenance (Annual)</Label>
                    <Input
                      id="maintenance"
                      type="number"
                      value={maintenanceCost}
                      onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                      data-testid="input-maintenance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacancy">Vacancy Rate (%)</Label>
                    <Input
                      id="vacancy"
                      type="number"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(Number(e.target.value))}
                      data-testid="input-vacancy"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-6 bg-muted/30 rounded-md">
                  <div className="text-center p-4 bg-background rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Gross Yield</p>
                    <p className="text-3xl font-bold text-primary" data-testid="text-gross-yield">
                      {calculations.grossYield.toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Before expenses</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-md border-2 border-primary">
                    <p className="text-sm text-muted-foreground mb-1">Net Yield</p>
                    <p className="text-3xl font-bold text-primary" data-testid="text-net-yield">
                      {calculations.netYield.toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">After all expenses</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-md space-y-2">
                  <h4 className="font-semibold">Income Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rent</span>
                      <span className="font-semibold">{formatCurrency(calculations.monthlyRent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Net Income</span>
                      <span className="font-semibold text-green-600">{formatCurrency(calculations.netIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Net Income</span>
                      <span className="font-semibold">{formatCurrency(calculations.monthlyNetIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Years to Breakeven</span>
                      <span className="font-semibold">{calculations.yearsToBreakeven.toFixed(1)} years</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-indigo-500/50">
              <CardHeader>
                <CardTitle className="text-lg">Dubai Yield Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {yieldBenchmarks.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-muted-foreground">{item.location}</span>
                      <Badge variant="outline">{item.yield}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Yield Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Furnished units command 10-20% premium
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Holiday homes can boost yields 30%+
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Service charges vary by community
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <OffPlanCTASection
          title="Find High-Yield Properties"
          subtitle="Connect with consultants who can identify properties matching your yield targets."
          ctaText="Get Yield Analysis"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Tools"
          links={[
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/tools-affordability-calculator", title: "Affordability Calculator" },
            { href: "/tools-payment-calculator", title: "Payment Calculator" },
            { href: "/dubai-roi-rental-yields", title: "Rental Yields Guide" },
            { href: "/compare-villa-vs-apartment", title: "Villa vs Apartment" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
