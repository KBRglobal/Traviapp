import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, Sparkles, RefreshCw, Clock, DollarSign } from "lucide-react";
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
  { factor: "Price", newBuild: "Premium (5-15% higher)", resale: "Often negotiable", winner: "resale" },
  { factor: "Condition", newBuild: "Brand new", resale: "Varies", winner: "newbuild" },
  { factor: "Warranty", newBuild: "1-year defect liability", resale: "None", winner: "newbuild" },
  { factor: "Customization", newBuild: "Sometimes available", resale: "Limited", winner: "newbuild" },
  { factor: "Move-in Speed", newBuild: "Immediate (ready)", resale: "30-60 days", winner: "newbuild" },
  { factor: "Floor/View Selection", newBuild: "Best units may be gone", resale: "What you see is what you get", winner: "tie" },
  { factor: "Price Negotiation", newBuild: "Limited", resale: "More flexible", winner: "resale" },
  { factor: "Hidden Issues", newBuild: "New = fewer issues", resale: "Inspect carefully", winner: "newbuild" },
  { factor: "Location Maturity", newBuild: "May still be developing", resale: "Established area", winner: "resale" },
  { factor: "Rental Track Record", newBuild: "None", resale: "Historical data available", winner: "resale" },
];

export default function CompareNewVsResale() {
  useDocumentMeta({
    title: "New Build vs Resale Property Dubai | Comparison Guide 2025",
    description: "Compare buying new ready properties vs resale in Dubai. New builds offer warranties and condition. Resales offer negotiability and proven locations. Full analysis.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "New Build vs Resale" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-200 border-violet-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Property Comparison
                </Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                  Ready Properties
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                New Build vs Resale: Ready Property Analysis
              </h1>
              <p className="text-lg md:text-xl text-violet-100 mb-6 max-w-3xl">
                When buying ready properties in Dubai, you can choose brand new developer 
                handovers or resale from current owners. Each has distinct advantages for 
                different buyer priorities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dubai-off-plan-properties">
                  <Button size="lg" data-testid="button-new-builds">
                    <Sparkles className="mr-2 h-4 w-4" />
                    New Projects
                  </Button>
                </Link>
                <Link href="/dubai-ready-properties">
                  <Button size="lg" variant="outline" data-testid="button-resale">
                    Browse Resale
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-violet-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  New Build (Ready)
                </CardTitle>
                <p className="text-sm text-muted-foreground">Brand new from developer</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-violet-500/10">
                    <div className="text-xl font-bold text-violet-600">Premium</div>
                    <div className="text-xs text-muted-foreground">Pricing</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-violet-500/10">
                    <div className="text-xl font-bold text-violet-600">1 Year</div>
                    <div className="text-xs text-muted-foreground">Warranty</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Brand new condition, no wear
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Defect liability coverage
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Modern finishes and layouts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-fuchsia-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-fuchsia-600" />
                  Resale Property
                </CardTitle>
                <p className="text-sm text-muted-foreground">From current owner</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-fuchsia-500/10">
                    <div className="text-xl font-bold text-fuchsia-600">Negotiable</div>
                    <div className="text-xs text-muted-foreground">Pricing</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-fuchsia-500/10">
                    <div className="text-xl font-bold text-fuchsia-600">Proven</div>
                    <div className="text-xs text-muted-foreground">Track Record</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    More room for price negotiation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Established neighborhood
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Known rental performance
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
                    <th className="text-left py-3 px-4 font-semibold bg-violet-500/5">New Build</th>
                    <th className="text-left py-3 px-4 font-semibold bg-fuchsia-500/5">Resale</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'newbuild' ? 'bg-green-500/10' : 'bg-violet-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'newbuild' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.newBuild}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'resale' ? 'bg-green-500/10' : 'bg-fuchsia-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'resale' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.resale}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'newbuild' ? 'default' : row.winner === 'resale' ? 'secondary' : 'outline'}>
                          {row.winner === 'newbuild' ? 'New' : row.winner === 'resale' ? 'Resale' : 'Tie'}
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
          <h2 className="text-2xl font-bold mb-6">Best Choice By Priority</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-violet-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose New Build If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want brand new, untouched property
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Value warranty and defect coverage
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer modern layouts and finishes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Plan to hold long-term
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-fuchsia-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Resale If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want to negotiate on price
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prefer established communities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Value rental track record data
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Seek value opportunities
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Find Your Ideal Property"
          subtitle="Connect with advisors who can source both new builds and resale opportunities matching your criteria."
          ctaText="Get Property Guidance"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Property Guides"
          links={[
            { href: "/compare-off-plan-vs-ready", title: "Off-Plan vs Ready" },
            { href: "/dubai-off-plan-properties", title: "Off-Plan Properties" },
            { href: "/dubai-ready-properties", title: "Ready Properties" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/dubai-roi-rental-yields", title: "Rental Yields Guide" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
