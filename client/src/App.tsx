import { useEffect, lazy, Suspense, useState } from "react";
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
import { LocaleProvider } from "@/lib/i18n/LocaleRouter";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { LiveEditProvider } from "@/components/live-edit";
import { SearchModal } from "@/components/search/SearchModal";

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
const OffPlanBest2026 = lazy(() => import("@/pages/off-plan-best-2026"));
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
const DistrictsGateway = lazy(() => import("@/pages/districts-gateway"));
const DistrictDowntownDubai = lazy(() => import("@/pages/district-downtown-dubai"));
const DistrictDubaiMarina = lazy(() => import("@/pages/district-dubai-marina"));
const DistrictJBR = lazy(() => import("@/pages/district-jbr"));
const DistrictPalmJumeirah = lazy(() => import("@/pages/district-palm-jumeirah"));
const DistrictJumeirah = lazy(() => import("@/pages/district-jumeirah"));
const DistrictBusinessBay = lazy(() => import("@/pages/district-business-bay"));
const DistrictOldDubai = lazy(() => import("@/pages/district-old-dubai"));
const DistrictDubaiCreekHarbour = lazy(() => import("@/pages/district-dubai-creek-harbour"));
const DistrictDubaiSouth = lazy(() => import("@/pages/district-dubai-south"));
const DistrictAlBarsha = lazy(() => import("@/pages/district-al-barsha"));
const DistrictDIFC = lazy(() => import("@/pages/district-difc"));
const DistrictDubaiHills = lazy(() => import("@/pages/district-dubai-hills"));
const DistrictJVC = lazy(() => import("@/pages/district-jvc"));
const DistrictBluewaters = lazy(() => import("@/pages/district-bluewaters-island"));
const DistrictInternationalCity = lazy(() => import("@/pages/district-international-city"));
const DistrictAlKarama = lazy(() => import("@/pages/district-al-karama"));
const LandingFreeDubai = lazy(() => import("@/pages/landing-free-dubai"));
const LandingDubaiLaws = lazy(() => import("@/pages/landing-dubai-laws"));
const LandingSheikhMohammed = lazy(() => import("@/pages/landing-sheikh-mohammed"));
const LandingDubai247 = lazy(() => import("@/pages/landing-dubai-247"));
const PublicShopping = lazy(() => import("@/pages/public-shopping"));
const PublicNews = lazy(() => import("@/pages/public-news"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ContentList = lazy(() => import("@/pages/content-list"));
const ContentEditor = lazy(() => import("@/pages/content-editor"));
const PublicContentViewer = lazy(() => import("@/pages/public-content-viewer"));
const PublicDocs = lazy(() => import("@/pages/public-docs"));

const RssFeeds = lazy(() => import("@/pages/rss-feeds"));
const AffiliateLinks = lazy(() => import("@/pages/affiliate-links"));
const MediaLibrary = lazy(() => import("@/pages/media-library"));
const ImageEngine = lazy(() => import("@/pages/admin-image-engine"));
const Settings = lazy(() => import("@/pages/settings"));
const ContentRulesPage = lazy(() => import("@/pages/content-rules"));
const AIArticleGenerator = lazy(() => import("@/pages/ai-article-generator"));
const TopicBankPage = lazy(() => import("@/pages/topic-bank"));
const KeywordsPage = lazy(() => import("@/pages/keywords"));
const ClustersPage = lazy(() => import("@/pages/clusters"));
const TagsPage = lazy(() => import("@/pages/tags"));
const UsersPage = lazy(() => import("@/pages/users"));
const HomepagePromotions = lazy(() => import("@/pages/homepage-promotions"));
const Analytics = lazy(() => import("@/pages/analytics"));
const AuditLogs = lazy(() => import("@/pages/audit-logs"));
const AdminLogs = lazy(() => import("@/pages/admin-logs"));
const NewsletterSubscribers = lazy(() => import("@/pages/newsletter-subscribers"));
const Campaigns = lazy(() => import("@/pages/campaigns"));
const TranslationsPage = lazy(() => import("@/pages/translations"));
const ContentCalendarPage = lazy(() => import("@/pages/content-calendar"));
const ContentTemplatesPage = lazy(() => import("@/pages/content-templates"));
const SEOAuditPage = lazy(() => import("@/pages/seo-audit"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Login = lazy(() => import("@/pages/login"));
const AccessDenied = lazy(() => import("@/pages/access-denied"));

// Eager load AI Assistant as it's critical UI
import { AIAssistant } from "@/components/ai-assistant";
import { CommandPalette, useCommandPalette } from "@/components/command-palette";
import { KeyboardShortcuts, useKeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { NotificationsCenter } from "@/components/notifications-center";
import { MultiTabProvider, EditorTabBar, TabCountBadge } from "@/components/multi-tab-editor";
import { ContentExpiryAlerts } from "@/components/content-expiry-alerts";
import { ErrorBoundary } from "@/components/error-boundary";

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
function AdminLandingPages() {
  return <ContentList type="landing_page" />;
}
function AdminCaseStudies() {
  return <ContentList type="case_study" />;
}
function AdminOffPlan() {
  return <ContentList type="off_plan" />;
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
        <Route path="/admin/landing-pages" component={AdminLandingPages} />
        <Route path="/admin/landing-pages/new" component={ContentEditor} />
        <Route path="/admin/landing-pages/:id" component={ContentEditor} />
        <Route path="/admin/case-studies" component={AdminCaseStudies} />
        <Route path="/admin/case-studies/new" component={ContentEditor} />
        <Route path="/admin/case-studies/:id" component={ContentEditor} />
        <Route path="/admin/off-plan" component={AdminOffPlan} />
        <Route path="/admin/off-plan/new" component={ContentEditor} />
        <Route path="/admin/off-plan/:id" component={ContentEditor} />
        <Route path="/admin/rss-feeds" component={RssFeeds} />
        <Route path="/admin/ai-generator" component={AIArticleGenerator} />
        <Route path="/admin/topic-bank" component={TopicBankPage} />
        <Route path="/admin/keywords" component={KeywordsPage} />
        <Route path="/admin/clusters" component={ClustersPage} />
        <Route path="/admin/tags" component={TagsPage} />
        <Route path="/admin/affiliate-links" component={AffiliateLinks} />
        <Route path="/admin/media" component={MediaLibrary} />
        <Route path="/admin/image-engine" component={ImageEngine} />
        <Route path="/admin/settings" component={Settings} />
        <Route path="/admin/content-rules" component={ContentRulesPage} />
        <Route path="/admin/users" component={UsersPage} />
        <Route path="/admin/homepage-promotions" component={HomepagePromotions} />
        <Route path="/admin/analytics" component={Analytics} />
        <Route path="/admin/audit-logs" component={AuditLogs} />
        <Route path="/admin/logs" component={AdminLogs} />
        <Route path="/admin/newsletter" component={NewsletterSubscribers} />
        <Route path="/admin/campaigns" component={Campaigns} />
        <Route path="/admin/translations" component={TranslationsPage} />
        <Route path="/admin/calendar" component={ContentCalendarPage} />
        <Route path="/admin/templates" component={ContentTemplatesPage} />
        <Route path="/admin/seo-audit" component={SEOAuditPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AdminLayout() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { open: commandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPalette();
  const { open: shortcutsOpen, setOpen: setShortcutsOpen } = useKeyboardShortcuts();
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
    <MultiTabProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar user={user} />
          <div className="flex flex-col flex-1 min-w-0">
            <header className="flex items-center justify-between gap-4 p-3 border-b sticky top-0 z-50 bg-background">
              <div className="flex items-center gap-3">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <TabCountBadge />
              </div>
              <div className="flex items-center gap-2">
                <ContentExpiryAlerts compact />
                <NotificationsCenter />
                <ThemeToggle />
              </div>
            </header>
            <EditorTabBar />
            <main className="flex-1 overflow-auto p-6">
              <ErrorBoundary>
                <AdminRouter />
              </ErrorBoundary>
            </main>
          </div>
          <AIAssistant />
          <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
          <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        </div>
      </SidebarProvider>
    </MultiTabProvider>
  );
}

// All public routes - will be mounted with and without locale prefix
const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/access-denied", component: AccessDenied },
  { path: "/coming-soon", component: ComingSoon },
  { path: "/search", component: PublicSearch },
  { path: "/attractions", component: PublicAttractions },
  { path: "/attractions/:slug", component: PublicContentViewer },
  { path: "/hotels", component: PublicHotels },
  { path: "/hotels/:slug", component: PublicContentViewer },
  { path: "/dining", component: PublicDining },
  { path: "/dining/:slug", component: PublicContentViewer },
  // Districts now handled by DistrictsGateway and specific district pages below
  { path: "/transport/:slug", component: PublicContentViewer },
  { path: "/articles", component: PublicArticles },
  { path: "/articles/:slug", component: PublicContentViewer },
  { path: "/events", component: PublicEvents },
  { path: "/events/:slug", component: PublicContentViewer },
  { path: "/itineraries/:slug", component: PublicContentViewer },
  { path: "/dubai-real-estate", component: PublicOffPlan },
  { path: "/dubai-off-plan-properties", component: PublicOffPlan },
  { path: "/dubai-off-plan-investment-guide", component: OffPlanInvestmentGuide },
  { path: "/how-to-buy-dubai-off-plan", component: OffPlanHowToBuy },
  { path: "/dubai-off-plan-payment-plans", component: OffPlanPaymentPlans },
  { path: "/best-off-plan-projects-dubai-2026", component: OffPlanBest2026 },
  { path: "/dubai-off-plan-business-bay", component: OffPlanBusinessBay },
  { path: "/dubai-off-plan-marina", component: OffPlanDubaiMarina },
  { path: "/dubai-off-plan-jvc", component: OffPlanJVC },
  { path: "/dubai-off-plan-palm-jumeirah", component: OffPlanPalmJumeirah },
  { path: "/dubai-off-plan-creek-harbour", component: OffPlanCreekHarbour },
  { path: "/dubai-off-plan-al-furjan", component: OffPlanAlFurjan },
  { path: "/dubai-off-plan-villas", component: OffPlanVillas },
  { path: "/off-plan-emaar", component: OffPlanEmaar },
  { path: "/off-plan-damac", component: OffPlanDamac },
  { path: "/off-plan-nakheel", component: OffPlanNakheel },
  { path: "/off-plan-meraas", component: OffPlanMeraas },
  { path: "/off-plan-sobha", component: OffPlanSobha },
  { path: "/off-plan-crypto-payments", component: OffPlanCryptoPayments },
  { path: "/off-plan-usdt", component: OffPlanUSDT },
  { path: "/off-plan-golden-visa", component: OffPlanGoldenVisa },
  { path: "/off-plan-post-handover", component: OffPlanPostHandover },
  { path: "/off-plan-escrow", component: OffPlanEscrow },
  { path: "/off-plan-vs-ready", component: OffPlanVsReady },
  { path: "/compare-off-plan-vs-ready", component: CompareOffPlanVsReady },
  { path: "/compare-jvc-vs-dubai-south", component: CompareJVCvsDubaiSouth },
  { path: "/compare-emaar-vs-damac", component: CompareEmaarVsDamac },
  { path: "/tools-roi-calculator", component: ToolsROICalculator },
  { path: "/tools-payment-calculator", component: ToolsPaymentCalculator },
  { path: "/tools-affordability-calculator", component: ToolsAffordabilityCalculator },
  { path: "/compare-downtown-vs-marina", component: CompareDowntownVsMarina },
  { path: "/case-study-jvc-investor", component: CaseStudyInvestorJVC },
  { path: "/case-study-crypto-buyer", component: CaseStudyCryptoBuyer },
  { path: "/dubai-roi-rental-yields", component: PillarROIRentalYields },
  { path: "/dubai-legal-security-guide", component: PillarLegalSecurity },
  { path: "/case-study-golden-visa", component: CaseStudyGoldenVisa },
  { path: "/compare-60-40-vs-80-20", component: Compare6040vs8020 },
  { path: "/compare-sobha-vs-meraas", component: CompareSobhaVsMeraas },
  { path: "/compare-crypto-vs-bank-transfer", component: CompareCryptoVsBankTransfer },
  { path: "/case-study-expat-family", component: CaseStudyExpatFamily },
  { path: "/case-study-investor-flip", component: CaseStudyInvestorFlip },
  { path: "/tools-currency-converter", component: ToolsCurrencyConverter },
  { path: "/compare-business-bay-vs-jlt", component: CompareBusinessBayVsJLT },
  { path: "/compare-new-vs-resale", component: CompareNewVsResale },
  { path: "/tools-fees-calculator", component: ToolsStampDutyCalculator },
  { path: "/compare-nakheel-vs-azizi", component: CompareNakheelVsAzizi },
  { path: "/compare-villa-vs-apartment", component: CompareVillaVsApartment },
  { path: "/tools-rental-yield-calculator", component: ToolsRentalYieldCalculator },
  { path: "/tools-mortgage-calculator", component: ToolsMortgageCalculator },
  { path: "/compare-studio-vs-1bed", component: CompareStudioVs1Bed },
  { path: "/case-study-portfolio-diversification", component: CaseStudyPortfolioDiversification },
  { path: "/case-study-off-plan-launch", component: CaseStudyOffPlanLaunch },
  { path: "/case-study-retirement-planning", component: CaseStudyRetirementPlanning },
  { path: "/glossary", component: GlossaryHub },
  // Landing pages
  { path: "/dubai/free-things-to-do", component: LandingFreeDubai },
  { path: "/dubai/laws-for-tourists", component: LandingDubaiLaws },
  { path: "/dubai/sheikh-mohammed-bin-rashid", component: LandingSheikhMohammed },
  { path: "/dubai/24-hours-open", component: LandingDubai247 },
  // Shopping page
  { path: "/shopping", component: PublicShopping },
  // News portal
  { path: "/news", component: PublicNews },
  // Documentation
  { path: "/docs", component: PublicDocs },
  { path: "/docs/:path*", component: PublicDocs },
  // District pages
  { path: "/districts", component: DistrictsGateway },
  { path: "/districts/downtown-dubai", component: DistrictDowntownDubai },
  { path: "/districts/dubai-marina", component: DistrictDubaiMarina },
  { path: "/districts/jbr-jumeirah-beach-residence", component: DistrictJBR },
  { path: "/districts/palm-jumeirah", component: DistrictPalmJumeirah },
  { path: "/districts/jumeirah", component: DistrictJumeirah },
  { path: "/districts/business-bay", component: DistrictBusinessBay },
  { path: "/districts/old-dubai", component: DistrictOldDubai },
  { path: "/districts/dubai-creek-harbour", component: DistrictDubaiCreekHarbour },
  { path: "/districts/dubai-south", component: DistrictDubaiSouth },
  { path: "/districts/al-barsha", component: DistrictAlBarsha },
  { path: "/districts/difc", component: DistrictDIFC },
  { path: "/districts/dubai-hills-estate", component: DistrictDubaiHills },
  { path: "/districts/jvc", component: DistrictJVC },
  { path: "/districts/bluewaters-island", component: DistrictBluewaters },
  { path: "/districts/international-city", component: DistrictInternationalCity },
  { path: "/districts/al-karama", component: DistrictAlKarama },
];

// Locale codes for URL prefixes (16 languages, English is default without prefix)
const LOCALE_PREFIXES = [
  "ar", "hi",                    // Tier 1
  "zh", "ru", "ur", "fr",        // Tier 2
  "de", "fa", "bn", "fil",       // Tier 3
  "es", "tr", "it", "ja", "ko", "he"  // Tier 4
];

function PublicRouter() {
  return (
    <Switch>
      {/* Routes with locale prefix (e.g., /ar/attractions, /hi/hotels) */}
      {LOCALE_PREFIXES.map((locale) => (
        <Route key={`${locale}-home`} path={`/${locale}`} component={PublicHome} />
      ))}
      {LOCALE_PREFIXES.flatMap((locale) =>
        publicRoutes.map((route) => (
          <Route
            key={`${locale}-${route.path}`}
            path={`/${locale}${route.path}`}
            component={route.component}
          />
        ))
      )}

      {/* Routes without locale prefix (English default) */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} component={route.component} />
      ))}
      <Route path="/" component={PublicHome} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  const [searchOpen, setSearchOpen] = useState(false);

  // Initialize Google Analytics on app load
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route changes
  useAnalytics();

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Suspense fallback={<PageLoader />}>
              {isAdminRoute ? (
                <AdminLayout />
              ) : (
                <LiveEditProvider>
                  <PublicRouter />
                </LiveEditProvider>
              )}
            </Suspense>
            <Toaster />
            {/* Global Search Modal */}
            <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
          </TooltipProvider>
        </FavoritesProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

export default App;
