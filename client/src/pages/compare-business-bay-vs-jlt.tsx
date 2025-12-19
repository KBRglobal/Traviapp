import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, Building2, TrendingUp, MapPin } from "lucide-react";
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
  { factor: "1-BR Starting Price", businessBay: "AED 1.1M", jlt: "AED 850K", winner: "jlt" },
  { factor: "Rental Yield", businessBay: "6.2%", jlt: "6.8%", winner: "jlt" },
  { factor: "Metro Access", businessBay: "Direct (Blue Line)", jlt: "Direct (Red Line)", winner: "tie" },
  { factor: "Proximity to Downtown", businessBay: "5 min", jlt: "20 min", winner: "businessbay" },
  { factor: "Price per Sqft", businessBay: "AED 1,800", jlt: "AED 1,200", winner: "jlt" },
  { factor: "Waterfront Views", businessBay: "Canal Views", jlt: "Lake Views", winner: "tie" },
  { factor: "Walk Score", businessBay: "Higher", jlt: "Lower", winner: "businessbay" },
  { factor: "Family Amenities", businessBay: "Limited", jlt: "Extensive", winner: "jlt" },
  { factor: "Corporate Tenants", businessBay: "Very High", jlt: "High", winner: "businessbay" },
  { factor: "Off-Plan Activity", businessBay: "Active", jlt: "Moderate", winner: "businessbay" },
];

export default function CompareBusinessBayVsJLT() {
  useDocumentMeta({
    title: "Business Bay vs JLT | Dubai Location Comparison 2025",
    description: "Compare Business Bay and JLT for property investment. Business Bay near Downtown from AED 1.1M. JLT offers better yields from AED 850K. Full analysis.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "Business Bay vs JLT" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-slate-500/20 text-slate-200 border-slate-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Location Comparison
                </Badge>
                <Badge variant="secondary" className="bg-gray-500/20 text-gray-200 border-gray-400/30">
                  Business Districts
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Business Bay vs JLT: Investment Analysis
              </h1>
              <p className="text-lg md:text-xl text-slate-100 mb-6 max-w-3xl">
                Two of Dubai's most popular business districts offer different value propositions. 
                Business Bay provides Downtown proximity from AED 1.1M. JLT delivers better yields 
                from AED 850K. Which fits your strategy?
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-business-bay">
                  <Button size="lg" data-testid="button-business-bay">
                    Business Bay Projects
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/off-plan-jlt">
                  <Button size="lg" variant="outline" data-testid="button-jlt">
                    JLT Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  Business Bay
                </CardTitle>
                <p className="text-sm text-muted-foreground">Downtown's business extension</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-slate-500/10">
                    <div className="text-xl font-bold text-slate-600">AED 1.1M</div>
                    <div className="text-xs text-muted-foreground">1-BR from</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-slate-500/10">
                    <div className="text-xl font-bold text-slate-600">6.2%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    5-minute walk to Downtown Dubai
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Dubai Canal waterfront
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Strong corporate tenant demand
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  JLT (Jumeirah Lake Towers)
                </CardTitle>
                <p className="text-sm text-muted-foreground">Established freehold community</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-amber-500/10">
                    <div className="text-xl font-bold text-amber-600">AED 850K</div>
                    <div className="text-xs text-muted-foreground">1-BR from</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-amber-500/10">
                    <div className="text-xl font-bold text-amber-600">6.8%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Lower entry point, better yields
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Artificial lakes and parks
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Family-friendly with restaurants
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
                    <th className="text-left py-3 px-4 font-semibold bg-slate-500/5">Business Bay</th>
                    <th className="text-left py-3 px-4 font-semibold bg-amber-500/5">JLT</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'businessbay' ? 'bg-green-500/10' : 'bg-slate-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'businessbay' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.businessBay}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'jlt' ? 'bg-green-500/10' : 'bg-amber-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'jlt' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.jlt}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'businessbay' ? 'default' : row.winner === 'jlt' ? 'secondary' : 'outline'}>
                          {row.winner === 'businessbay' ? 'B.Bay' : row.winner === 'jlt' ? 'JLT' : 'Tie'}
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
          <h2 className="text-2xl font-bold mb-6">Investment Verdict</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Business Bay If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want Downtown-adjacent prestige
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Target corporate professionals
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize capital appreciation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Value walkability and new builds
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose JLT If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize rental yield
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want lower entry price
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Seek established community feel
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Value family amenities
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Explore Both Locations"
          subtitle="Connect with advisors who can help you choose the right business district for your investment strategy."
          ctaText="Get Location Guidance"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Location Guides"
          links={[
            { href: "/off-plan-business-bay", title: "Business Bay" },
            { href: "/off-plan-jlt", title: "JLT Guide" },
            { href: "/compare-downtown-vs-marina", title: "Downtown vs Marina" },
            { href: "/compare-jvc-vs-dubai-south", title: "JVC vs Dubai South" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
