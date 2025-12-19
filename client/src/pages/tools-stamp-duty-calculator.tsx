import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Calculator, ChevronRight, Receipt, Building, FileText, Info } from "lucide-react";
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

export default function ToolsStampDutyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(1000000);
  const [propertyType, setPropertyType] = useState("apartment");
  const [buyerType, setBuyerType] = useState("individual");
  
  useDocumentMeta({
    title: "Dubai Property Fees Calculator 2025 | DLD, Registration & Agency Fees",
    description: "Calculate all Dubai property purchase fees: 4% DLD registration, agency commission, Oqood fees, and admin charges. Free calculator with detailed breakdown.",
    ogType: "website"
  });

  const fees = useMemo(() => {
    const dldFee = propertyPrice * 0.04;
    const agencyFee = propertyPrice * 0.02;
    const adminFee = 4000;
    const oqoodFee = propertyPrice <= 500000 ? 2000 : 4000;
    const trusteeFee = 4200;
    
    const totalFees = dldFee + agencyFee + adminFee + oqoodFee + trusteeFee;
    const totalCost = propertyPrice + totalFees;
    const feePercentage = (totalFees / propertyPrice) * 100;
    
    return {
      dldFee,
      agencyFee,
      adminFee,
      oqoodFee,
      trusteeFee,
      totalFees,
      totalCost,
      feePercentage
    };
  }, [propertyPrice, propertyType, buyerType]);

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
    { label: "Fees Calculator" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-rose-900 via-pink-800 to-red-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-rose-500/20 text-rose-200 border-rose-400/30">
                  <Calculator className="h-3 w-3 mr-1" />
                  Free Tool
                </Badge>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-200 border-pink-400/30">
                  2025 Rates
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Dubai Property Fees Calculator
              </h1>
              <p className="text-lg md:text-xl text-rose-100 mb-6 max-w-3xl">
                Calculate all fees associated with buying property in Dubai: DLD registration 
                (4%), agency commission, Oqood fees, and administrative charges. Know your 
                total cost before you buy.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Fee Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="property-price">Property Price: {formatCurrency(propertyPrice)}</Label>
                  <Slider
                    id="property-price"
                    min={300000}
                    max={20000000}
                    step={50000}
                    value={[propertyPrice]}
                    onValueChange={(value) => setPropertyPrice(value[0])}
                    className="w-full"
                    data-testid="slider-property-price"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>AED 300K</span>
                    <span>AED 20M</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger id="property-type" data-testid="select-property-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyer-type">Buyer Type</Label>
                    <Select value={buyerType} onValueChange={setBuyerType}>
                      <SelectTrigger id="buyer-type" data-testid="select-buyer-type">
                        <SelectValue placeholder="Select buyer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-md space-y-4">
                  <h3 className="font-semibold text-lg">Fee Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <span>DLD Registration Fee (4%)</span>
                      </div>
                      <span className="font-semibold" data-testid="text-dld-fee">{formatCurrency(fees.dldFee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Agency Commission (2%)</span>
                      <span className="font-semibold">{formatCurrency(fees.agencyFee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Admin Fee</span>
                      <span className="font-semibold">{formatCurrency(fees.adminFee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Oqood Registration</span>
                      <span className="font-semibold">{formatCurrency(fees.oqoodFee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Trustee Fee</span>
                      <span className="font-semibold">{formatCurrency(fees.trusteeFee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-primary/10 rounded-md px-3">
                      <span className="font-semibold">Total Fees</span>
                      <span className="font-bold text-lg text-primary" data-testid="text-total-fees">
                        {formatCurrency(fees.totalFees)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Total Cost (Property + Fees)</span>
                      <span className="text-2xl font-bold text-primary" data-testid="text-total-cost">
                        {formatCurrency(fees.totalCost)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Fees represent {fees.feePercentage.toFixed(1)}% of property price
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-rose-500/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Fee Explanations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">DLD Registration (4%)</h4>
                  <p className="text-muted-foreground">
                    Dubai Land Department fee for property registration. Mandatory for all transactions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Agency Commission (2%)</h4>
                  <p className="text-muted-foreground">
                    Standard broker fee. Some developers cover this on off-plan sales.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Oqood Fee</h4>
                  <p className="text-muted-foreground">
                    Off-plan registration with DLD before title deed issuance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Trustee Fee</h4>
                  <p className="text-muted-foreground">
                    DLD-approved trustee for transaction processing.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Fee Savings Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Some developers cover agency fees
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Launch events may waive DLD fees
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    Negotiate agency commission
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <OffPlanCTASection
          title="Understand All Costs"
          subtitle="Connect with consultants who can provide detailed cost breakdowns and identify fee-saving opportunities."
          ctaText="Get Cost Analysis"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Tools"
          links={[
            { href: "/tools-affordability-calculator", title: "Affordability Calculator" },
            { href: "/tools-payment-calculator", title: "Payment Calculator" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/tools-currency-converter", title: "Currency Converter" },
            { href: "/dubai-legal-security-guide", title: "Legal Guide" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
