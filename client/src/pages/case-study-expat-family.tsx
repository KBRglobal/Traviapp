import { Link } from "wouter";
import { Users, ChevronRight, Home, School, Calendar, MapPin, CheckCircle, Quote, Star } from "lucide-react";
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

export default function CaseStudyExpatFamily() {
  useDocumentMeta({
    title: "Case Study: British Expat Family Dubai Property Purchase | Off-Plan Success",
    description: "How a British expat family bought a 3-BR in Dubai Hills for AED 2.8M. School proximity, community amenities, and family-friendly investment decisions explained.",
    ogType: "article"
  });

  const breadcrumbItems = [
    { label: "Off-Plan", href: "/dubai-off-plan-properties" },
    { label: "Case Studies", href: "/dubai-off-plan-properties" },
    { label: "Expat Family Story" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OffPlanStatsBar />
      <OffPlanSubNav activeHref="/dubai-off-plan-properties" />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <OffPlanBreadcrumb items={breadcrumbItems} />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-sky-900 via-cyan-800 to-teal-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-sky-500/20 text-sky-200 border-sky-400/30">
                  <Users className="h-3 w-3 mr-1" />
                  Family Case Study
                </Badge>
                <Badge variant="secondary" className="bg-teal-500/20 text-teal-200 border-teal-400/30">
                  3-Bedroom Purchase
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                British Expat Family Finds Their Dubai Home
              </h1>
              <p className="text-lg md:text-xl text-sky-100 mb-6 max-w-3xl">
                James and Sarah, relocating from London with two children, purchased a 
                3-BR villa in Dubai Hills Estate for AED 2.8M. Their focus: school proximity, 
                community amenities, and long-term family lifestyle.
              </p>
              <div className="flex items-center gap-4 text-sky-100">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dubai Hills Estate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Family of 4</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Family Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-sky-500/10 rounded-md">
                    <div className="text-2xl font-bold text-sky-600">AED 2.8M</div>
                    <div className="text-sm text-muted-foreground">Purchase Price</div>
                  </div>
                  <div className="text-center p-4 bg-sky-500/10 rounded-md">
                    <div className="text-2xl font-bold text-sky-600">3-BR</div>
                    <div className="text-sm text-muted-foreground">Townhouse</div>
                  </div>
                  <div className="text-center p-4 bg-sky-500/10 rounded-md">
                    <div className="text-2xl font-bold text-sky-600">2 Kids</div>
                    <div className="text-sm text-muted-foreground">Ages 6 & 9</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  James, an IT consultant, received a Dubai offer. Sarah researched schools 
                  for 6 months before finding GEMS Wellington in Dubai Hills. The property 
                  choice revolved around school proximity and community amenities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decision Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-6 border-l-2 border-sky-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-sky-500" />
                  <h4 className="font-semibold">Step 1: School Research</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shortlisted top British curriculum schools. GEMS Wellington in Dubai Hills 
                    rated Outstanding by KHDA with waiting lists.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-sky-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-sky-500" />
                  <h4 className="font-semibold">Step 2: Community Comparison</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Compared Arabian Ranches, Dubai Hills, and Springs. Dubai Hills offered 
                    newest infrastructure, central location, and direct school access.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-sky-500/30">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-sky-500" />
                  <h4 className="font-semibold">Step 3: Property Selection</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Chose Emaar 3-BR townhouse with garden. 5-minute walk to school, pool, 
                    park access, and Dubai Hills Mall nearby.
                  </p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-semibold text-green-600">Step 4: Purchase Complete</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Paid 60% during construction, 40% at handover. Moved in August 2024 
                    before school year started.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Quote className="h-5 w-5" />
                  Family Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-sky-500 pl-4">
                  "We could have found a cheaper property elsewhere, but the school commute 
                  would have been 45 minutes each way. That's two hours daily we now spend 
                  with our kids instead. The premium for Dubai Hills was absolutely worth it 
                  for our family life."
                </blockquote>
                <p className="mt-4 text-sm text-muted-foreground">- Sarah Thompson, British Expat</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Family-Focused Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">5-minute walk to school</span>
                      <p className="text-sm text-muted-foreground">GEMS Wellington within community</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Safe cycling paths</span>
                      <p className="text-sm text-muted-foreground">Children cycle to friends independently</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Community pool access</span>
                      <p className="text-sm text-muted-foreground">Multiple pools and parks nearby</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Dubai Hills Mall</span>
                      <p className="text-sm text-muted-foreground">5-minute drive for shopping and dining</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-sky-500/50">
              <CardHeader>
                <CardTitle className="text-lg">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-semibold">3-BR Townhouse</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold">Dubai Hills</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-semibold">AED 2,800,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-semibold">Emaar</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Payment Plan</span>
                  <span className="font-semibold">60/40</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">School Proximity</span>
                  <span className="font-semibold">5-min walk</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Find Family Properties</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore Dubai communities with top schools and family amenities.
                </p>
                <Link href="/dubai-off-plan-investment-guide">
                  <Button className="w-full" data-testid="button-family-consultation">
                    <Home className="mr-2 h-4 w-4" />
                    Get Family Guidance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <OffPlanCTASection
          title="Plan Your Family's Dubai Move"
          subtitle="Connect with consultants who understand school proximity, family communities, and expat lifestyle needs."
          ctaText="Start Family Consultation"
          onCtaClick={() => {}}
        />

        <RelatedLinks
          title="Related Family Resources"
          links={[
            { href: "/off-plan-dubai-hills", title: "Dubai Hills Guide" },
            { href: "/off-plan-emaar", title: "Emaar Properties" },
            { href: "/off-plan-family-living", title: "Family Living Guide" },
            { href: "/dubai-off-plan-investment-guide", title: "Investment Guide" },
            { href: "/tools-affordability-calculator", title: "Affordability Calculator" },
            { href: "/case-study-golden-visa", title: "Golden Visa Story" }
          ]}
        />

        <TrustSignals />
      </main>
    </div>
  );
}
