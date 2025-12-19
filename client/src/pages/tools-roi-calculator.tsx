import { useState } from "react";
import { Link } from "wouter";
import { Calculator, ChevronRight, TrendingUp, DollarSign, Home, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function ToolsROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState(1000000);
  const [downPayment, setDownPayment] = useState(20);
  const [appreciationRate, setAppreciationRate] = useState(20);
  const [rentalYield, setRentalYield] = useState(7);
  const [holdingPeriod, setHoldingPeriod] = useState("3");
  const [propertyType, setPropertyType] = useState("apartment");

  useDocumentMeta({
    title: "Dubai Off-Plan ROI Calculator | Free Investment Tool 2025",
    description: "Calculate your Dubai off-plan property ROI. Estimate capital appreciation, rental yields, and total returns. Free interactive calculator with real market data.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Tools", href: "/dubai-off-plan-properties" },
    { label: "ROI Calculator" }
  ];

  // Calculate ROI
  const years = parseInt(holdingPeriod);
  const downPaymentAmount = purchasePrice * (downPayment / 100);
  const appreciatedValue = purchasePrice * Math.pow(1 + appreciationRate / 100, years);
  const capitalGain = appreciatedValue - purchasePrice;
  const annualRent = purchasePrice * (rentalYield / 100);
  const totalRentalIncome = annualRent * years;
  const totalReturn = capitalGain + totalRentalIncome;
  const roiOnInvestment = (totalReturn / downPaymentAmount) * 100;
  const annualizedROI = roiOnInvestment / years;

  const formatAED = (value: number) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                  <Calculator className="h-3 w-3 mr-1" />
                  Free Tool
                </Badge>
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                  Interactive
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Dubai Off-Plan ROI Calculator
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl">
                Calculate your potential returns on Dubai off-plan property investment. 
                Estimate capital appreciation, rental income, and total ROI based on 
                real market data and your specific investment parameters.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Investment Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="purchasePrice">Purchase Price (AED)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="mt-1"
                  data-testid="input-purchase-price"
                />
                <p className="text-xs text-muted-foreground mt-1">JVC from AED 420K, Business Bay from AED 1.1M</p>
              </div>

              <div>
                <Label>Down Payment: {downPayment}%</Label>
                <Slider
                  value={[downPayment]}
                  onValueChange={(value) => setDownPayment(value[0])}
                  min={10}
                  max={100}
                  step={5}
                  className="mt-2"
                  data-testid="slider-down-payment"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10% (Typical off-plan)</span>
                  <span>100% (Full payment)</span>
                </div>
              </div>

              <div>
                <Label>Expected Appreciation: {appreciationRate}%</Label>
                <Slider
                  value={[appreciationRate]}
                  onValueChange={(value) => setAppreciationRate(value[0])}
                  min={5}
                  max={40}
                  step={1}
                  className="mt-2"
                  data-testid="slider-appreciation"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5% (Conservative)</span>
                  <span>40% (Optimistic)</span>
                </div>
              </div>

              <div>
                <Label>Rental Yield: {rentalYield}%</Label>
                <Slider
                  value={[rentalYield]}
                  onValueChange={(value) => setRentalYield(value[0])}
                  min={4}
                  max={10}
                  step={0.5}
                  className="mt-2"
                  data-testid="slider-rental-yield"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>4% (Premium areas)</span>
                  <span>10% (High yield areas)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="holdingPeriod">Holding Period</Label>
                  <Select value={holdingPeriod} onValueChange={setHoldingPeriod}>
                    <SelectTrigger className="mt-1" data-testid="select-holding-period">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="7">7 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="mt-1" data-testid="select-property-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Your Projected Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-muted/30">
                  <div className="text-sm text-muted-foreground">Investment</div>
                  <div className="text-xl font-bold">{formatAED(downPaymentAmount)}</div>
                  <div className="text-xs text-muted-foreground">{downPayment}% down payment</div>
                </div>
                <div className="p-4 rounded-md bg-muted/30">
                  <div className="text-sm text-muted-foreground">Property Value at End</div>
                  <div className="text-xl font-bold">{formatAED(appreciatedValue)}</div>
                  <div className="text-xs text-muted-foreground">After {years} years</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted/30 rounded-md">
                  <span>Capital Appreciation</span>
                  <span className="font-semibold text-green-600">{formatAED(capitalGain)}</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded-md">
                  <span>Total Rental Income ({years} yrs)</span>
                  <span className="font-semibold text-green-600">{formatAED(totalRentalIncome)}</span>
                </div>
                <div className="flex justify-between p-3 bg-primary/10 rounded-md border border-primary/20">
                  <span className="font-semibold">Total Return</span>
                  <span className="font-bold text-primary">{formatAED(totalReturn)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center p-4 rounded-md bg-green-500/10">
                  <div className="text-3xl font-bold text-green-600">{roiOnInvestment.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Total ROI</div>
                </div>
                <div className="text-center p-4 rounded-md bg-primary/10">
                  <div className="text-3xl font-bold text-primary">{annualizedROI.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Annual ROI</div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-md text-sm">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  This calculation is for illustrative purposes. Actual returns depend on market conditions, 
                  location, and property management. Excludes fees (4% DLD, service charges).
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Understanding Your ROI</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Capital Appreciation</h3>
                <p className="text-sm text-muted-foreground">
                  Off-plan properties in Dubai typically appreciate 15-30% between purchase and handover. 
                  JVC and Dubai South show highest growth potential.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Home className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Rental Yields</h3>
                <p className="text-sm text-muted-foreground">
                  Dubai offers 5-9% gross rental yields. High-yield areas include JVC (7.7%), 
                  Dubai South (8.5%), and Business Bay (7.2%).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <DollarSign className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Tax-Free Returns</h3>
                <p className="text-sm text-muted-foreground">
                  Dubai has no income tax on rental earnings and no capital gains tax on property 
                  sales, maximizing your net returns.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Sample Investment Scenarios</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget: AED 500K</CardTitle>
                <p className="text-sm text-muted-foreground">Studio in JVC</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Down Payment (10%):</span>
                    <span>AED 50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Appreciation (25%):</span>
                    <span className="text-green-600">AED 125,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rental (3 yrs @ 7.5%):</span>
                    <span className="text-green-600">AED 112,500</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>ROI on Investment:</span>
                    <span className="text-primary">475%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget: AED 1.5M</CardTitle>
                <p className="text-sm text-muted-foreground">1-BR in Business Bay</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Down Payment (20%):</span>
                    <span>AED 300,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Appreciation (20%):</span>
                    <span className="text-green-600">AED 300,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rental (3 yrs @ 7%):</span>
                    <span className="text-green-600">AED 315,000</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>ROI on Investment:</span>
                    <span className="text-primary">205%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget: AED 3M</CardTitle>
                <p className="text-sm text-muted-foreground">2-BR in Dubai Hills</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Down Payment (20%):</span>
                    <span>AED 600,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Appreciation (18%):</span>
                    <span className="text-green-600">AED 540,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rental (5 yrs @ 5.5%):</span>
                    <span className="text-green-600">AED 825,000</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>ROI on Investment:</span>
                    <span className="text-primary">228%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Get Personalized ROI Analysis"
          subtitle="Connect with investment consultants who can provide detailed ROI projections based on specific projects and your investment goals."
          ctaText="Get Expert Analysis"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Investment Resources"
          links={[
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans" },
            { href: "/compare-off-plan-vs-ready", title: "Off-Plan vs Ready" },
            { href: "/off-plan-jvc", title: "JVC Properties" },
            { href: "/off-plan-business-bay", title: "Business Bay" },
            { href: "/best-off-plan-projects-dubai-2025", title: "Best Projects 2025" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
