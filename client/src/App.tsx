import { useEffect } from "react";
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
import ComingSoon from "@/pages/coming-soon";
import Dashboard from "@/pages/dashboard";
import ContentList from "@/pages/content-list";
import ContentEditor from "@/pages/content-editor";
// Public content viewer for all content types
import PublicContentViewer from "@/pages/public-content-viewer";

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
import RssFeeds from "@/pages/rss-feeds";
import AffiliateLinks from "@/pages/affiliate-links";
import MediaLibrary from "@/pages/media-library";
import Settings from "@/pages/settings";
import AIArticleGenerator from "@/pages/ai-article-generator";
import TopicBankPage from "@/pages/topic-bank";
import KeywordsPage from "@/pages/keywords";
import ClustersPage from "@/pages/clusters";
import UsersPage from "@/pages/users";
import HomepagePromotions from "@/pages/homepage-promotions";
import Analytics from "@/pages/analytics";
import AuditLogs from "@/pages/audit-logs";
import NewsletterSubscribers from "@/pages/newsletter-subscribers";
import Campaigns from "@/pages/campaigns";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import AccessDenied from "@/pages/access-denied";
import { AIAssistant } from "@/components/ai-assistant";

function AdminRouter() {
  return (
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
        {isAdminRoute ? (
          <AdminLayout />
        ) : (
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/access-denied" component={AccessDenied} />
            <Route path="/attractions/:slug" component={PublicContentViewer} />
            <Route path="/hotels/:slug" component={PublicContentViewer} />
            <Route path="/dining/:slug" component={PublicContentViewer} />
            <Route path="/districts/:slug" component={PublicContentViewer} />
            <Route path="/transport/:slug" component={PublicContentViewer} />
            <Route path="/articles/:slug" component={PublicContentViewer} />
            <Route path="/events/:slug" component={PublicContentViewer} />
            <Route path="/itineraries/:slug" component={PublicContentViewer} />
            <Route path="/" component={ComingSoon} />
            <Route component={NotFound} />
          </Switch>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
