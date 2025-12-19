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
