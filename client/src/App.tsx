import { useEffect, lazy, Suspense } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useAnalytics } from "@/hooks/use-analytics";
import { initGA } from "@/lib/analytics";
import { Loader2 } from "lucide-react";

// Lazy load all pages for better performance
const ComingSoon = lazy(() => import("@/pages/coming-soon"));
const PublicHome = lazy(() => import("@/pages/public-home"));
const PublicAttractions = lazy(() => import("@/pages/public-attractions"));
const PublicHotels = lazy(() => import("@/pages/public-hotels"));
const PublicDining = lazy(() => import("@/pages/public-dining"));
const PublicDistricts = lazy(() => import("@/pages/public-districts"));
const PublicArticles = lazy(() => import("@/pages/public-articles"));
const PublicEvents = lazy(() => import("@/pages/public-events"));
const PublicSearch = lazy(() => import("@/pages/public-search"));
const PublicOffPlan = lazy(() => import("@/pages/public-off-plan"));
const OffPlanInvestmentGuide = lazy(() => import("@/pages/off-plan-investment-guide"));
const OffPlanHowToBuy = lazy(() => import("@/pages/off-plan-how-to-buy"));
const OffPlanPaymentPlans = lazy(() => import("@/pages/off-plan-payment-plans"));
const OffPlanBest2025 = lazy(() => import("@/pages/off-plan-best-2025"));
const OffPlanBusinessBay = lazy(() => import("@/pages/off-plan-business-bay"));
const OffPlanDubaiMarina = lazy(() => import("@/pages/off-plan-dubai-marina"));
const OffPlanJVC = lazy(() => import("@/pages/off-plan-jvc"));
const OffPlanPalmJumeirah = lazy(() => import("@/pages/off-plan-palm-jumeirah"));
const OffPlanCreekHarbour = lazy(() => import("@/pages/off-plan-creek-harbour"));
const OffPlanAlFurjan = lazy(() => import("@/pages/off-plan-al-furjan"));
const OffPlanVillas = lazy(() => import("@/pages/off-plan-villas"));
const OffPlanEmaar = lazy(() => import("@/pages/off-plan-emaar"));
const OffPlanDamac = lazy(() => import("@/pages/off-plan-damac"));
const OffPlanNakheel = lazy(() => import("@/pages/off-plan-nakheel"));
const OffPlanMeraas = lazy(() => import("@/pages/off-plan-meraas"));
const OffPlanSobha = lazy(() => import("@/pages/off-plan-sobha"));
const OffPlanCryptoPayments = lazy(() => import("@/pages/off-plan-crypto-payments"));
const OffPlanUSDT = lazy(() => import("@/pages/off-plan-usdt"));
const OffPlanGoldenVisa = lazy(() => import("@/pages/off-plan-golden-visa"));
const OffPlanPostHandover = lazy(() => import("@/pages/off-plan-post-handover"));
const OffPlanEscrow = lazy(() => import("@/pages/off-plan-escrow"));
const OffPlanVsReady = lazy(() => import("@/pages/off-plan-vs-ready"));
const CompareOffPlanVsReady = lazy(() => import("@/pages/compare-off-plan-vs-ready"));
const CompareJVCvsDubaiSouth = lazy(() => import("@/pages/compare-jvc-vs-dubai-south"));
const CompareEmaarVsDamac = lazy(() => import("@/pages/compare-emaar-vs-damac"));
const ToolsROICalculator = lazy(() => import("@/pages/tools-roi-calculator"));
const ToolsPaymentCalculator = lazy(() => import("@/pages/tools-payment-calculator"));
const ToolsAffordabilityCalculator = lazy(() => import("@/pages/tools-affordability-calculator"));
const CompareDowntownVsMarina = lazy(() => import("@/pages/compare-downtown-vs-marina"));
const CaseStudyInvestorJVC = lazy(() => import("@/pages/case-study-investor-jvc"));
const CaseStudyCryptoBuyer = lazy(() => import("@/pages/case-study-crypto-buyer"));
const PillarROIRentalYields = lazy(() => import("@/pages/pillar-roi-rental-yields"));
const PillarLegalSecurity = lazy(() => import("@/pages/pillar-legal-security"));
const CaseStudyGoldenVisa = lazy(() => import("@/pages/case-study-golden-visa"));
const Compare6040vs8020 = lazy(() => import("@/pages/compare-60-40-vs-80-20"));
const CompareSobhaVsMeraas = lazy(() => import("@/pages/compare-sobha-vs-meraas"));
const CompareCryptoVsBankTransfer = lazy(() => import("@/pages/compare-crypto-vs-bank-transfer"));
const CaseStudyExpatFamily = lazy(() => import("@/pages/case-study-expat-family"));
const CaseStudyInvestorFlip = lazy(() => import("@/pages/case-study-investor-flip"));
const ToolsCurrencyConverter = lazy(() => import("@/pages/tools-currency-converter"));
const CompareBusinessBayVsJLT = lazy(() => import("@/pages/compare-business-bay-vs-jlt"));
const CompareNewVsResale = lazy(() => import("@/pages/compare-new-vs-resale"));
const ToolsStampDutyCalculator = lazy(() => import("@/pages/tools-stamp-duty-calculator"));
const CompareNakheelVsAzizi = lazy(() => import("@/pages/compare-nakheel-vs-azizi"));
const CompareVillaVsApartment = lazy(() => import("@/pages/compare-villa-vs-apartment"));
const ToolsRentalYieldCalculator = lazy(() => import("@/pages/tools-rental-yield-calculator"));
const ToolsMortgageCalculator = lazy(() => import("@/pages/tools-mortgage-calculator"));
const CompareStudioVs1Bed = lazy(() => import("@/pages/compare-studio-vs-1bed"));
const CaseStudyPortfolioDiversification = lazy(() => import("@/pages/case-study-portfolio-diversification"));
const CaseStudyOffPlanLaunch = lazy(() => import("@/pages/case-study-off-plan-launch"));
const CaseStudyRetirementPlanning = lazy(() => import("@/pages/case-study-retirement-planning"));
const GlossaryHub = lazy(() => import("@/pages/glossary-hub"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ContentList = lazy(() => import("@/pages/content-list"));
const ContentEditor = lazy(() => import("@/pages/content-editor"));
const PublicContentViewer = lazy(() => import("@/pages/public-content-viewer"));

const RssFeeds = lazy(() => import("@/pages/rss-feeds"));
const AffiliateLinks = lazy(() => import("@/pages/affiliate-links"));
const MediaLibrary = lazy(() => import("@/pages/media-library"));
const Settings = lazy(() => import("@/pages/settings"));
const AIArticleGenerator = lazy(() => import("@/pages/ai-article-generator"));
const TopicBankPage = lazy(() => import("@/pages/topic-bank"));
const KeywordsPage = lazy(() => import("@/pages/keywords"));
const ClustersPage = lazy(() => import("@/pages/clusters"));
const TagsPage = lazy(() => import("@/pages/tags"));
const UsersPage = lazy(() => import("@/pages/users"));
const HomepagePromotions = lazy(() => import("@/pages/homepage-promotions"));
const Analytics = lazy(() => import("@/pages/analytics"));
const AuditLogs = lazy(() => import("@/pages/audit-logs"));
const NewsletterSubscribers = lazy(() => import("@/pages/newsletter-subscribers"));
const Campaigns = lazy(() => import("@/pages/campaigns"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Login = lazy(() => import("@/pages/login"));
const AccessDenied = lazy(() => import("@/pages/access-denied"));

// Eager load AI Assistant as it's critical UI
import { AIAssistant } from "@/components/ai-assistant";

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

// Admin list wrappers
function AdminAttractions() {
  return <ContentList type="attraction" />;
}
function AdminHotels() {
  return <ContentList type="hotel" />;
}
function AdminDining() {
  return <ContentList type="dining" />;
}
function AdminDistricts() {
  return <ContentList type="district" />;
}
function AdminTransport() {
  return <ContentList type="transport" />;
}
function AdminArticles() {
  return <ContentList type="article" />;
}
function AdminEvents() {
  return <ContentList type="event" />;
}
function AdminItineraries() {
  return <ContentList type="itinerary" />;
}

function AdminRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/admin" component={Dashboard} />
        <Route path="/admin/attractions" component={AdminAttractions} />
        <Route path="/admin/attractions/new" component={ContentEditor} />
        <Route path="/admin/attractions/:id" component={ContentEditor} />
        <Route path="/admin/hotels" component={AdminHotels} />
        <Route path="/admin/hotels/new" component={ContentEditor} />
        <Route path="/admin/hotels/:id" component={ContentEditor} />
        <Route path="/admin/dining" component={AdminDining} />
        <Route path="/admin/dining/new" component={ContentEditor} />
        <Route path="/admin/dining/:id" component={ContentEditor} />
        <Route path="/admin/districts" component={AdminDistricts} />
        <Route path="/admin/districts/new" component={ContentEditor} />
        <Route path="/admin/districts/:id" component={ContentEditor} />
        <Route path="/admin/transport" component={AdminTransport} />
        <Route path="/admin/transport/new" component={ContentEditor} />
        <Route path="/admin/transport/:id" component={ContentEditor} />
        <Route path="/admin/articles" component={AdminArticles} />
        <Route path="/admin/articles/new" component={ContentEditor} />
        <Route path="/admin/articles/:id" component={ContentEditor} />
        <Route path="/admin/events" component={AdminEvents} />
        <Route path="/admin/events/new" component={ContentEditor} />
        <Route path="/admin/events/:id" component={ContentEditor} />
        <Route path="/admin/itineraries" component={AdminItineraries} />
        <Route path="/admin/itineraries/new" component={ContentEditor} />
        <Route path="/admin/itineraries/:id" component={ContentEditor} />
        <Route path="/admin/rss-feeds" component={RssFeeds} />
        <Route path="/admin/ai-generator" component={AIArticleGenerator} />
        <Route path="/admin/topic-bank" component={TopicBankPage} />
        <Route path="/admin/keywords" component={KeywordsPage} />
        <Route path="/admin/clusters" component={ClustersPage} />
        <Route path="/admin/tags" component={TagsPage} />
        <Route path="/admin/affiliate-links" component={AffiliateLinks} />
        <Route path="/admin/media" component={MediaLibrary} />
        <Route path="/admin/settings" component={Settings} />
        <Route path="/admin/users" component={UsersPage} />
        <Route path="/admin/homepage-promotions" component={HomepagePromotions} />
        <Route path="/admin/analytics" component={Analytics} />
        <Route path="/admin/audit-logs" component={AuditLogs} />
        <Route path="/admin/newsletter" component={NewsletterSubscribers} />
        <Route path="/admin/campaigns" component={Campaigns} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AdminLayout() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 p-3 border-b sticky top-0 z-50 bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <AdminRouter />
          </main>
        </div>
        <AIAssistant />
      </div>
    </SidebarProvider>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  // Initialize Google Analytics on app load
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route changes
  useAnalytics();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={<PageLoader />}>
          {isAdminRoute ? (
            <AdminLayout />
          ) : (
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/access-denied" component={AccessDenied} />
              <Route path="/coming-soon" component={ComingSoon} />
              <Route path="/search" component={PublicSearch} />
              <Route path="/attractions" component={PublicAttractions} />
              <Route path="/attractions/:slug" component={PublicContentViewer} />
              <Route path="/hotels" component={PublicHotels} />
              <Route path="/hotels/:slug" component={PublicContentViewer} />
              <Route path="/dining" component={PublicDining} />
              <Route path="/dining/:slug" component={PublicContentViewer} />
              <Route path="/districts" component={PublicDistricts} />
              <Route path="/districts/:slug" component={PublicContentViewer} />
              <Route path="/transport/:slug" component={PublicContentViewer} />
              <Route path="/articles" component={PublicArticles} />
              <Route path="/articles/:slug" component={PublicContentViewer} />
              <Route path="/events" component={PublicEvents} />
              <Route path="/events/:slug" component={PublicContentViewer} />
              <Route path="/itineraries/:slug" component={PublicContentViewer} />
              <Route path="/dubai-real-estate" component={PublicOffPlan} />
              <Route path="/dubai-off-plan-properties" component={PublicOffPlan} />
              <Route path="/dubai-off-plan-investment-guide" component={OffPlanInvestmentGuide} />
              <Route path="/how-to-buy-dubai-off-plan" component={OffPlanHowToBuy} />
              <Route path="/dubai-off-plan-payment-plans" component={OffPlanPaymentPlans} />
              <Route path="/best-off-plan-projects-dubai-2025" component={OffPlanBest2025} />
              <Route path="/dubai-off-plan-business-bay" component={OffPlanBusinessBay} />
              <Route path="/dubai-off-plan-marina" component={OffPlanDubaiMarina} />
              <Route path="/dubai-off-plan-jvc" component={OffPlanJVC} />
              <Route path="/dubai-off-plan-palm-jumeirah" component={OffPlanPalmJumeirah} />
              <Route path="/dubai-off-plan-creek-harbour" component={OffPlanCreekHarbour} />
              <Route path="/dubai-off-plan-al-furjan" component={OffPlanAlFurjan} />
              <Route path="/dubai-off-plan-villas" component={OffPlanVillas} />
              <Route path="/off-plan-emaar" component={OffPlanEmaar} />
              <Route path="/off-plan-damac" component={OffPlanDamac} />
              <Route path="/off-plan-nakheel" component={OffPlanNakheel} />
              <Route path="/off-plan-meraas" component={OffPlanMeraas} />
              <Route path="/off-plan-sobha" component={OffPlanSobha} />
              <Route path="/off-plan-crypto-payments" component={OffPlanCryptoPayments} />
              <Route path="/off-plan-usdt" component={OffPlanUSDT} />
              <Route path="/off-plan-golden-visa" component={OffPlanGoldenVisa} />
              <Route path="/off-plan-post-handover" component={OffPlanPostHandover} />
              <Route path="/off-plan-escrow" component={OffPlanEscrow} />
              <Route path="/off-plan-vs-ready" component={OffPlanVsReady} />
              <Route path="/compare-off-plan-vs-ready" component={CompareOffPlanVsReady} />
              <Route path="/compare-jvc-vs-dubai-south" component={CompareJVCvsDubaiSouth} />
              <Route path="/compare-emaar-vs-damac" component={CompareEmaarVsDamac} />
              <Route path="/tools-roi-calculator" component={ToolsROICalculator} />
              <Route path="/tools-payment-calculator" component={ToolsPaymentCalculator} />
              <Route path="/tools-affordability-calculator" component={ToolsAffordabilityCalculator} />
              <Route path="/compare-downtown-vs-marina" component={CompareDowntownVsMarina} />
              <Route path="/case-study-jvc-investor" component={CaseStudyInvestorJVC} />
              <Route path="/case-study-crypto-buyer" component={CaseStudyCryptoBuyer} />
              <Route path="/dubai-roi-rental-yields" component={PillarROIRentalYields} />
              <Route path="/dubai-legal-security-guide" component={PillarLegalSecurity} />
              <Route path="/case-study-golden-visa" component={CaseStudyGoldenVisa} />
              <Route path="/compare-60-40-vs-80-20" component={Compare6040vs8020} />
              <Route path="/compare-sobha-vs-meraas" component={CompareSobhaVsMeraas} />
              <Route path="/compare-crypto-vs-bank-transfer" component={CompareCryptoVsBankTransfer} />
              <Route path="/case-study-expat-family" component={CaseStudyExpatFamily} />
              <Route path="/case-study-investor-flip" component={CaseStudyInvestorFlip} />
              <Route path="/tools-currency-converter" component={ToolsCurrencyConverter} />
              <Route path="/compare-business-bay-vs-jlt" component={CompareBusinessBayVsJLT} />
              <Route path="/compare-new-vs-resale" component={CompareNewVsResale} />
              <Route path="/tools-fees-calculator" component={ToolsStampDutyCalculator} />
              <Route path="/compare-nakheel-vs-azizi" component={CompareNakheelVsAzizi} />
              <Route path="/compare-villa-vs-apartment" component={CompareVillaVsApartment} />
              <Route path="/tools-rental-yield-calculator" component={ToolsRentalYieldCalculator} />
              <Route path="/tools-mortgage-calculator" component={ToolsMortgageCalculator} />
              <Route path="/compare-studio-vs-1bed" component={CompareStudioVs1Bed} />
              <Route path="/case-study-portfolio-diversification" component={CaseStudyPortfolioDiversification} />
              <Route path="/case-study-off-plan-launch" component={CaseStudyOffPlanLaunch} />
              <Route path="/case-study-retirement-planning" component={CaseStudyRetirementPlanning} />
              <Route path="/glossary" component={GlossaryHub} />
              <Route path="/" component={PublicHome} />
              <Route component={NotFound} />
            </Switch>
          )}
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
