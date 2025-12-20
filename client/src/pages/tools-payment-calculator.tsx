import { useState } from "react";
import { Link } from "wouter";
import { Calculator, ChevronRight, Calendar, DollarSign, Info, Building, Check } from "lucide-react";
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

const paymentPlans = [
  { id: "60-40", name: "60/40 Plan", during: 60, handover: 40, post: 0, duration: "Construction" },
  { id: "70-30", name: "70/30 Plan", during: 70, handover: 30, post: 0, duration: "Construction" },
  { id: "80-20", name: "80/20 Plan", during: 80, handover: 20, post: 0, duration: "Construction" },
  { id: "10-70-20", name: "10/70/20 (Emaar)", during: 10, handover: 70, post: 20, duration: "3 years post" },
  { id: "20-60-20", name: "20/60/20 Plan", during: 20, handover: 60, post: 20, duration: "2 years post" },
  { id: "50-50", name: "50/50 Plan", during: 50, handover: 50, post: 0, duration: "Construction" },
];

export default function ToolsPaymentCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(1000000);
  const [selectedPlan, setSelectedPlan] = useState("60-40");
  const [constructionMonths, setConstructionMonths] = useState("36");
  const [postHandoverMonths, setPostHandoverMonths] = useState("24");

  useDocumentMeta({
    title: "Dubai Payment Plan Calculator | Off-Plan Installment Tool 2026",
    description: "Calculate Dubai off-plan payment schedules. Compare 60/40, 70/30, 80/20, and post-handover plans. Free interactive tool shows monthly installments.",
    ogType: "website"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Tools", href: "/dubai-off-plan-properties" },
    { label: "Payment Calculator" }
  ];

  const plan = paymentPlans.find(p => p.id === selectedPlan) || paymentPlans[0];
  const constructionPeriod = parseInt(constructionMonths);
  const postHandoverPeriod = parseInt(postHandoverMonths);
  
  const duringAmount = purchasePrice * (plan.during / 100);
  const handoverAmount = purchasePrice * (plan.handover / 100);
  const postAmount = purchasePrice * (plan.post / 100);
  
  const monthlyDuring = duringAmount / constructionPeriod;
  const monthlyPost = plan.post > 0 ? postAmount / postHandoverPeriod : 0;

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
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
                  <Calculator className="h-3 w-3 mr-1" />
                  Free Tool
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  Compare Plans
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Payment Plan Calculator
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-6 max-w-3xl">
                Calculate your monthly payments for Dubai off-plan properties. Compare 60/40, 
                70/30, 80/20, and post-handover payment plans to find the best option for your budget.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Payment Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="purchasePrice">Property Price (AED)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="mt-1"
                  data-testid="input-property-price"
                />
              </div>

              <div>
                <Label htmlFor="paymentPlan">Payment Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="mt-1" data-testid="select-payment-plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentPlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="constructionMonths">Construction Period</Label>
                <Select value={constructionMonths} onValueChange={setConstructionMonths}>
                  <SelectTrigger className="mt-1" data-testid="select-construction-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 Months (2 Years)</SelectItem>
                    <SelectItem value="30">30 Months (2.5 Years)</SelectItem>
                    <SelectItem value="36">36 Months (3 Years)</SelectItem>
                    <SelectItem value="42">42 Months (3.5 Years)</SelectItem>
                    <SelectItem value="48">48 Months (4 Years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {plan.post > 0 && (
                <div>
                  <Label htmlFor="postHandoverMonths">Post-Handover Period</Label>
                  <Select value={postHandoverMonths} onValueChange={setPostHandoverMonths}>
                    <SelectTrigger className="mt-1" data-testid="select-post-handover">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Months (1 Year)</SelectItem>
                      <SelectItem value="24">24 Months (2 Years)</SelectItem>
                      <SelectItem value="36">36 Months (3 Years)</SelectItem>
                      <SelectItem value="60">60 Months (5 Years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Your Payment Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
                <div className="text-sm text-muted-foreground mb-1">Selected Plan</div>
                <div className="text-xl font-bold">{plan.name}</div>
                <div className="text-sm text-muted-foreground">{plan.during}% during | {plan.handover}% handover {plan.post > 0 ? `| ${plan.post}% post` : ''}</div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-md bg-muted/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">During Construction</span>
                    <Badge>{plan.during}%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span className="font-semibold">{formatAED(duringAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Payment:</span>
                    <span className="font-semibold text-primary">{formatAED(monthlyDuring)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Over {constructionPeriod} months</div>
                </div>

                <div className="p-4 rounded-md bg-muted/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">At Handover</span>
                    <Badge variant="secondary">{plan.handover}%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lump Sum Payment:</span>
                    <span className="font-semibold">{formatAED(handoverAmount)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Due when keys are handed over</div>
                </div>

                {plan.post > 0 && (
                  <div className="p-4 rounded-md bg-green-500/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Post-Handover</span>
                      <Badge variant="outline">{plan.post}%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Amount:</span>
                      <span className="font-semibold">{formatAED(postAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Payment:</span>
                      <span className="font-semibold text-green-600">{formatAED(monthlyPost)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Over {postHandoverPeriod} months after handover</div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-md text-sm">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Excludes 4% DLD transfer fee (AED {(purchasePrice * 0.04).toLocaleString()}) payable at registration.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Compare All Payment Plans</h2>
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Plan</th>
                    <th className="text-center py-3 px-4">During Construction</th>
                    <th className="text-center py-3 px-4">At Handover</th>
                    <th className="text-center py-3 px-4">Post-Handover</th>
                    <th className="text-center py-3 px-4">Monthly (During)</th>
                    <th className="text-center py-3 px-4">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentPlans.map((p, index) => {
                    const duringAmt = purchasePrice * (p.during / 100);
                    const monthly = duringAmt / parseInt(constructionMonths);
                    return (
                      <tr key={index} className={`border-b last:border-0 ${p.id === selectedPlan ? 'bg-primary/5' : ''}`}>
                        <td className="py-3 px-4 font-medium">
                          {p.name}
                          {p.id === selectedPlan && <Badge variant="outline" className="ml-2">Selected</Badge>}
                        </td>
                        <td className="py-3 px-4 text-center">{p.during}%</td>
                        <td className="py-3 px-4 text-center">{p.handover}%</td>
                        <td className="py-3 px-4 text-center">{p.post > 0 ? `${p.post}%` : '-'}</td>
                        <td className="py-3 px-4 text-center font-semibold">{formatAED(monthly)}</td>
                        <td className="py-3 px-4 text-center text-muted-foreground text-xs">
                          {p.post > 0 ? 'Max flexibility' : p.during >= 70 ? 'Lower handover' : 'Balanced'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Payment Plan Benefits</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <DollarSign className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">No Mortgage Required</h3>
                <p className="text-sm text-muted-foreground">
                  Spread payments over 2-5 years without bank involvement, credit checks, 
                  or interest charges.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Calendar className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Budget-Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  Small monthly installments during construction make property ownership 
                  accessible with less upfront capital.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Building className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Rent-to-Pay</h3>
                <p className="text-sm text-muted-foreground">
                  Post-handover plans let you rent out the property and use rental income 
                  to cover remaining payments.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Find Projects With Your Ideal Payment Plan"
          subtitle="Connect with consultants who can match you with off-plan projects offering the payment flexibility you need."
          ctaText="Get Payment Plan Options"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Resources"
          links={[
            { href: "/dubai-off-plan-payment-plans", title: "Payment Plans Guide" },
            { href: "/off-plan-post-handover", title: "Post-Handover Plans" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/compare-off-plan-vs-ready", title: "Off-Plan vs Ready" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
