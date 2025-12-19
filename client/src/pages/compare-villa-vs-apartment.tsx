import { Link } from "wouter";
import { Scale, ChevronRight, CheckCircle, Home, Building2, TrendingUp, Users } from "lucide-react";
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
  { factor: "Entry Price (3-BR)", villa: "AED 1.8M", apartment: "AED 1.2M", winner: "apartment" },
  { factor: "Rental Yield", villa: "4-5%", apartment: "6-8%", winner: "apartment" },
  { factor: "Space per AED", villa: "Higher sqft", apartment: "Lower sqft", winner: "villa" },
  { factor: "Appreciation", villa: "Strong (land value)", apartment: "Moderate", winner: "villa" },
  { factor: "Tenant Pool", villa: "Families", apartment: "Singles, couples", winner: "apartment" },
  { factor: "Maintenance Cost", villa: "Higher", apartment: "Lower", winner: "apartment" },
  { factor: "Service Charges", villa: "Lower (plot-based)", apartment: "Higher (common areas)", winner: "villa" },
  { factor: "Privacy", villa: "High", apartment: "Lower", winner: "villa" },
  { factor: "Amenities Access", villa: "Community-based", apartment: "Building amenities", winner: "apartment" },
  { factor: "Liquidity", villa: "Slower to sell", apartment: "Faster turnover", winner: "apartment" },
];

export default function CompareVillaVsApartment() {
  useDocumentMeta({
    title: "Villa vs Apartment Dubai | Property Type Comparison 2025",
    description: "Compare villas and apartments for Dubai investment. Villas offer space and appreciation from AED 1.8M. Apartments deliver higher yields from AED 500K. Full analysis.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Compare", href: "/dubai-off-plan-properties" },
    { label: "Villa vs Apartment" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  <Scale className="h-3 w-3 mr-1" />
                  Property Type Comparison
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                  Investment Analysis
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Villa vs Apartment: Investment Analysis
              </h1>
              <p className="text-lg md:text-xl text-amber-100 mb-6 max-w-3xl">
                Two distinct property types with different investment characteristics. 
                Villas offer space and land value appreciation. Apartments provide higher 
                yields and easier management. Which suits your strategy?
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/off-plan-villas">
                  <Button size="lg" data-testid="button-villas">
                    <Home className="mr-2 h-4 w-4" />
                    Villa Projects
                  </Button>
                </Link>
                <Link href="/off-plan-apartments">
                  <Button size="lg" variant="outline" data-testid="button-apartments">
                    Apartment Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-amber-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-amber-600" />
                  Villa / Townhouse
                </CardTitle>
                <p className="text-sm text-muted-foreground">Space, privacy, and land value</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-amber-500/10">
                    <div className="text-xl font-bold text-amber-600">AED 1.8M</div>
                    <div className="text-xs text-muted-foreground">3-BR from</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-amber-500/10">
                    <div className="text-xl font-bold text-amber-600">4-5%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Private garden and outdoor space
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Land value appreciation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Family-oriented communities
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-600" />
                  Apartment
                </CardTitle>
                <p className="text-sm text-muted-foreground">Yields, amenities, and liquidity</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-md bg-orange-500/10">
                    <div className="text-xl font-bold text-orange-600">AED 500K</div>
                    <div className="text-xs text-muted-foreground">Studio from</div>
                  </div>
                  <div className="text-center p-3 rounded-md bg-orange-500/10">
                    <div className="text-xl font-bold text-orange-600">6-8%</div>
                    <div className="text-xs text-muted-foreground">Rental Yield</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Higher rental yields
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Building amenities included
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Easier to manage and sell
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
                    <th className="text-left py-3 px-4 font-semibold bg-amber-500/5">Villa</th>
                    <th className="text-left py-3 px-4 font-semibold bg-orange-500/5">Apartment</th>
                    <th className="text-center py-3 px-4 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.factor}</td>
                      <td className={`py-3 px-4 ${row.winner === 'villa' ? 'bg-green-500/10' : 'bg-amber-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'villa' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.villa}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${row.winner === 'apartment' ? 'bg-green-500/10' : 'bg-orange-500/5'}`}>
                        <div className="flex items-center gap-2">
                          {row.winner === 'apartment' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                          {row.apartment}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.winner === 'villa' ? 'default' : 'secondary'}>
                          {row.winner === 'villa' ? 'Villa' : 'Apartment'}
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
            <Card className="border-amber-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Villa If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize capital appreciation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want land ownership
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Target family tenant market
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Plan long-term investment
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-500/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Choose Apartment If You:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Prioritize rental income
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Want easier property management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Have lower initial budget
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    Value liquidity for exit
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <OffPlanCTASection
          title="Find Your Property Type"
          subtitle="Connect with consultants who can match properties to your investment goals."
          ctaText="Get Property Guidance"
          onCtaClick={() => window.open('https://thrivestate.ae', '_blank')}
        />

        <RelatedLinks
          title="Related Property Guides"
          links={[
            { href: "/off-plan-villas", title: "Villa Projects" },
            { href: "/off-plan-apartments", title: "Apartment Projects" },
            { href: "/tools-roi-calculator", title: "ROI Calculator" },
            { href: "/dubai-roi-rental-yields", title: "Rental Yields Guide" },
            { href: "/case-study-expat-family", title: "Family Case Study" },
            { href: "/glossary", title: "Real Estate Glossary" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
