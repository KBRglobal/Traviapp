import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import PublicHome from "@/pages/public-home";
import PublicHotels from "@/pages/public-hotels";
import PublicAttractions from "@/pages/public-attractions";
import PublicArticles from "@/pages/public-articles";
import PublicDining from "@/pages/public-dining";
import PublicDistricts from "@/pages/public-districts";
import PublicTransport from "@/pages/public-transport";
import PublicSearch from "@/pages/public-search";
import PublicContentDetail from "@/pages/public-content-detail";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
import Dashboard from "@/pages/dashboard";
import Attractions from "@/pages/attractions";
import Hotels from "@/pages/hotels";
import Dining from "@/pages/dining";
import Districts from "@/pages/districts";
import Transport from "@/pages/transport";
import Articles from "@/pages/articles";
import ContentEditor from "@/pages/content-editor";
import RssFeeds from "@/pages/rss-feeds";
import AffiliateLinks from "@/pages/affiliate-links";
import MediaLibrary from "@/pages/media-library";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/attractions" component={Attractions} />
      <Route path="/admin/attractions/new" component={ContentEditor} />
      <Route path="/admin/attractions/:id" component={ContentEditor} />
      <Route path="/admin/hotels" component={Hotels} />
      <Route path="/admin/hotels/new" component={ContentEditor} />
      <Route path="/admin/hotels/:id" component={ContentEditor} />
      <Route path="/admin/dining" component={Dining} />
      <Route path="/admin/dining/new" component={ContentEditor} />
      <Route path="/admin/dining/:id" component={ContentEditor} />
      <Route path="/admin/districts" component={Districts} />
      <Route path="/admin/districts/new" component={ContentEditor} />
      <Route path="/admin/districts/:id" component={ContentEditor} />
      <Route path="/admin/transport" component={Transport} />
      <Route path="/admin/transport/new" component={ContentEditor} />
      <Route path="/admin/transport/:id" component={ContentEditor} />
      <Route path="/admin/articles" component={Articles} />
      <Route path="/admin/articles/new" component={ContentEditor} />
      <Route path="/admin/articles/:id" component={ContentEditor} />
      <Route path="/admin/rss-feeds" component={RssFeeds} />
      <Route path="/admin/affiliate-links" component={AffiliateLinks} />
      <Route path="/admin/media" component={MediaLibrary} />
      <Route path="/admin/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 p-3 border-b sticky top-0 z-50 bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <AdminRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isAdminRoute ? (
          <AdminLayout />
        ) : (
          <Switch>
            <Route path="/" component={PublicHome} />
            <Route path="/hotels" component={PublicHotels} />
            <Route path="/hotels/:slug" component={PublicContentDetail} />
            <Route path="/attractions" component={PublicAttractions} />
            <Route path="/attractions/:slug" component={PublicContentDetail} />
            <Route path="/articles" component={PublicArticles} />
            <Route path="/articles/:slug" component={PublicContentDetail} />
            <Route path="/dining" component={PublicDining} />
            <Route path="/dining/:slug" component={PublicContentDetail} />
            <Route path="/districts" component={PublicDistricts} />
            <Route path="/districts/:slug" component={PublicContentDetail} />
            <Route path="/transport" component={PublicTransport} />
            <Route path="/transport/:slug" component={PublicContentDetail} />
            <Route path="/search" component={PublicSearch} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsConditions} />
            <Route component={NotFound} />
          </Switch>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
