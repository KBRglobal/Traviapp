import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Calculator, ChevronRight, Home, Percent, DollarSign, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

export default function ToolsMortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(25);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(25);
  const [buyerType, setBuyerType] = useState("expat");
  
  useDocumentMeta({
    title: "Dubai Mortgage Calculator 2025 | Monthly Payment Estimator",
    description: "Calculate your Dubai mortgage payments. Estimate monthly repayments based on property price, down payment, interest rate, and loan term. Free calculator for UAE residents and expats.",
    ogType: "website"
  });

  const calculations = useMemo(() => {
    const minDownPayment = buyerType === "uae_national" ? 15 : 20;
    const effectiveDownPayment = Math.max(downPayment, minDownPayment);
    
    const downPaymentAmount = propertyPrice * (effectiveDownPayment / 100);
    const loanAmount = propertyPrice - downPaymentAmount;
    
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numberOfPayments;
    }
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    const processingFee = loanAmount * 0.01;
    const valuationFee = 3000;
    const lifeInsurance = loanAmount * 0.004;
    const propertyInsurance = loanAmount * 0.0005;
    
    const debtToIncome = (monthlyPayment / (propertyPrice * 0.004)) * 100;
    
    return {
      loanAmount,
      downPaymentAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      processingFee,
      valuationFee,
      lifeInsurance,
      propertyInsurance,
      effectiveDownPayment,
      minDownPayment,
      debtToIncome
    };
  }, [propertyPrice, downPayment, interestRate, loanTerm, buyerType]);

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
    { label: "Mortgage Calculator" }
  ];

  const bankRates = [
    { bank: "Emirates NBD", rate: "4.24%", type: "Variable" },
    { bank: "ADCB", rate: "4.49%", type: "Variable" },
    { bank: "Mashreq", rate: "4.59%", type: "Variable" },
    { bank: "FAB", rate: "4.29%", type: "Variable" },
    { bank: "DIB", rate: "4.99%", type: "Islamic" },
    { bank: "RAKBANK", rate: "4.69%", type: "Variable" },
  ];

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
                  2025 Rates
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Dubai Mortgage Calculator
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl">
                Estimate your monthly mortgage payments for Dubai property. Factor in down payment, 
                interest rates, and loan terms to plan your investment. Works for UAE nationals 
                and expats.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Mortgage Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Property Price: {formatCurrency(propertyPrice)}</Label>
                  <Slider
                    min={500000}
                    max={20000000}
                    step={50000}
                    value={[propertyPrice]}
                    onValueChange={(value) => setPropertyPrice(value[0])}
                    data-testid="slider-property-price"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>AED 500K</span>
                    <span>AED 20M</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyer-type">Buyer Type</Label>
                    <Select value={buyerType} onValueChange={setBuyerType}>
                      <SelectTrigger id="buyer-type" data-testid="select-buyer-type">
                        <SelectValue placeholder="Select buyer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expat">Expat Resident</SelectItem>
                        <SelectItem value="uae_national">UAE National</SelectItem>
                        <SelectItem value="non_resident">Non-Resident</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-term">Loan Term (Years)</Label>
                    <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(Number(v))}>
                      <SelectTrigger id="loan-term" data-testid="select-loan-term">
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="10">10 years</SelectItem>
                        <SelectItem value="15">15 years</SelectItem>
                        <SelectItem value="20">20 years</SelectItem>
                        <SelectItem value="25">25 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>
                    Down Payment: {calculations.effectiveDownPayment}% ({formatCurrency(calculations.downPaymentAmount)})
                    {downPayment < calculations.minDownPayment && (
                      <span className="text-xs text-amber-600 ml-2">
                        (Min {calculations.minDownPayment}% for {buyerType === 'uae_national' ? 'UAE nationals' : 'expats'})
                      </span>
                    )}
                  </Label>
                  <Slider
                    min={15}
                    max={80}
                    step={1}
                    value={[downPayment]}
                    onValueChange={(value) => setDownPayment(value[0])}
                    data-testid="slider-down-payment"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15%</span>
                    <span>80%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Interest Rate: {interestRate}% per year</Label>
                  <Slider
                    min={2}
                    max={8}
                    step={0.1}
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    data-testid="slider-interest-rate"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2%</span>
                    <span>8%</span>
                  </div>
                </div>

                <div className="p-6 bg-primary/10 rounded-md">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
                    <p className="text-4xl font-bold text-primary" data-testid="text-monthly-payment">
                      {formatCurrency(calculations.monthlyPayment)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      For {loanTerm} years at {interestRate}% interest
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Loan Amount</span>
                      <span className="font-semibold" data-testid="text-loan-amount">{formatCurrency(calculations.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Down Payment</span>
                      <span className="font-semibold">{formatCurrency(calculations.downPaymentAmount)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Total Interest</span>
                      <span className="font-semibold text-amber-600">{formatCurrency(calculations.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Total Repayment</span>
                      <span className="font-semibold">{formatCurrency(calculations.totalPayment)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-md">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Additional Costs (Estimated)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Fee (1%)</span>
                      <span>{formatCurrency(calculations.processingFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valuation Fee</span>
                      <span>{formatCurrency(calculations.valuationFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Life Insurance (0.4%/yr)</span>
                      <span>{formatCurrency(calculations.lifeInsurance)}/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property Insurance</span>
                      <span>{formatCurrency(calculations.propertyInsurance)}/yr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Current Bank Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bankRates.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <span className="font-medium text-sm">{item.bank}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{item.type}</Badge>
                      </div>
                      <span className="font-semibold text-primary">{item.rate}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Rates are indicative and subject to change. Contact banks for current offers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Eligibility Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">UAE Nationals</h4>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>Min down payment: 15%</li>
                    <li>Max LTV: 85%</li>
                    <li>Max term: 25 years</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Expat Residents</h4>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>Min down payment: 20%</li>
                    <li>Max LTV: 80%</li>
                    <li>Max term: 25 years</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Non-Residents</h4>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>Min down payment: 50%</li>
                    <li>Max LTV: 50%</li>
                    <li>Limited bank options</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Mortgage Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Compare rates from multiple banks
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Consider early repayment penalties
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Fixed vs variable rate trade-offs
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Islamic financing alternatives
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <OffPlanCTASection
          title="Get Pre-Approved for a Mortgage"
          subtitle="Connect with mortgage advisors who can help you secure the best rates for your Dubai property purchase."
          ctaText="Get Mortgage Guidance"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Tools"
          links={[
            { href: "/tools-affordability-calculator", title: "Affordability Calculator" },
            { href: "/tools-fees-calculator", title: "Fees Calculator" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/tools-payment-calculator", title: "Payment Calculator" },
            { href: "/dubai-legal-security-guide", title: "Legal Guide" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
