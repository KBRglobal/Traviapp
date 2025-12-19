import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, MapPin, TrendingUp, Building, Waves, DollarSign } from "lucide-react";
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
  { factor: "1-BR Starting Price", downtown: "AED 1.8M", marina: "AED 1.5M", winner: "marina" },
  { factor: "2-BR Starting Price", downtown: "AED 2.8M", marina: "AED 2.2M", winner: "marina" },
  { factor: "Rental Yield", downtown: "5.5%", marina: "6.2%", winner: "marina" },
  { factor: "Capital Appreciation", downtown: "18%", marina: "15%", winner: "downtown" },
  { factor: "Views", downtown: "Burj Khalifa/Skyline", marina: "Marina/Sea", winner: "tie" },
  { factor: "Walk Score", downtown: "95/100", marina: "92/100", winner: "downtown" },
  { factor: "Metro Access", downtown: "Direct (Multiple)", marina: "Direct (2 stations)", winner: "downtown" },
  { factor: "Beach Access", downtown: "15 min drive", marina: "5 min walk", winner: "marina" },
  { factor: "Dining/Entertainment", downtown: "Dubai Mall, Opera", marina: "Marina Walk, JBR", winner: "tie" },
  { factor: "Brand Recognition", downtown: "Highest", marina: "High", winner: "downtown" },
];

export default function CompareDowntownVsMarina() {
  useDocumentMeta({
    title: "Downtown Dubai vs Marina | Premium Location Comparison 2025",
    description: "Compare Downtown Dubai and Dubai Marina for luxury off-plan investment. Downtown offers Burj views from AED 1.8M. Marina provides beach lifestyle from AED 1.5M.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "Downtown vs Marina" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-rose-900 via-pink-800 to-fuchsia-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-rose-500/20 text-rose-200 border-rose-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Premium Comparison
                </Badge>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-200 border-pink-400/30">
                  Luxury Lifestyle
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Downtown Dubai vs Marina: Luxury Investment 2025
              </h1>
              <p className="text-lg md:text-xl text-rose-100 mb-6 max-w-3xl">
                Two of Dubai's most prestigious addresses offer different lifestyle propositions. 
                Downtown delivers iconic Burj Khalifa views and urban living. Marina provides 
                waterfront lifestyle and beach access. Compare to find your ideal investment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-business-bay">
                  <Button size="lg" data-testid="button-explore-downtown">
                    Downtown Projects
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/off-plan-dubai-marina">
                  <Button size="lg" variant="outline" data-testid="button-explore-marina">
                    Marina Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-rose-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-rose-600" />
                  Downtown Dubai
                </CardTitle>
                <p className="text-sm text-muted-foreground">The heart of Dubai's urban lifestyle</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-rose-500/10">
                    <div className="text-xl font-bold text-rose-600">AED 1.8M</div>
                    <div className="text-xs text-muted-foreground">1-BR Entry</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-rose-500/10">
                    <div className="text-xl font-bold text-rose-600">5.5%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-rose-500/10">
                    <div className="text-xl font-bold text-rose-600">18%</div>
                    <div className="text-xs text-muted-foreground">Appreciation</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-rose-500/10">
                    <div className="text-xl font-bold text-rose-600">95/100</div>
                    <div className="text-xs text-muted-foreground">Walk Score</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Burj Khalifa and fountain views
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Dubai Mall access (1,200+ stores)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Highest brand recognition globally
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-blue-600" />
                  Dubai Marina
                </CardTitle>
                <p className="text-sm text-muted-foreground">Waterfront living with beach access</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-blue-500/10">
                    <div className="text-xl font-bold text-blue-600">AED 1.5M</div>
                    <div className="text-xs text-muted-foreground">1-BR Entry</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-blue-500/10">
                    <div className="text-xl font-bold text-blue-600">6.2%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-blue-500/10">
                    <div className="text-xl font-bold text-blue-600">15%</div>
                    <div className="text-xs text-muted-foreground">Appreciation</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-blue-500/10">
                    <div className="text-xl font-bold text-blue-600">5 min</div>
                    <div className="text-xs text-muted-foreground">To Beach</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Marina and sea views
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    JBR beach walking distance
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Strong expat rental demand
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
                    <th className="text-left py-3 px-4 font-semibold bg-rose-500/5">Downtown</th>
                    <th className="text-left py-3 px-4 font-semibold bg-blue-500/5">Marina</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'downtown' ? 'bg-green-500/10' : 'bg-rose-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'downtown' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.downtown}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'marina' ? 'bg-green-500/10' : 'bg-blue-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'marina' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.marina}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'downtown' ? 'default' : row.winner === 'marina' ? 'secondary' : 'outline'}>
                          {row.winner === 'downtown' ? 'Downtown' : row.winner === 'marina' ? 'Marina' : 'Tie'}
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
            <Card className="border-rose-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Downtown If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want iconic Burj Khalifa views
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize capital appreciation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Need maximum walkability
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Target luxury short-term rentals
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Marina If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want waterfront/beach lifestyle
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize rental yield
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have smaller budget
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Target expat professionals
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Get Expert Location Advice"
          subtitle="Connect with consultants who specialize in premium Dubai locations. Find the perfect investment for your lifestyle and goals."
          ctaText="Get Expert Guidance"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Comparison Guides"
          links={[
            { href: "/off-plan-business-bay", title: "Downtown/Business Bay" },
            { href: "/off-plan-dubai-marina", title: "Dubai Marina" },
            { href: "/compare-jvc-vs-dubai-south", title: "JVC vs Dubai South" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/best-off-plan-projects-dubai-2025", title: "Best 2025 Projects" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
