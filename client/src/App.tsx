import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/pages/dashboard";
import Attractions from "@/pages/attractions";
import Hotels from "@/pages/hotels";
import Articles from "@/pages/articles";
import ContentEditor from "@/pages/content-editor";
import RssFeeds from "@/pages/rss-feeds";
import AffiliateLinks from "@/pages/affiliate-links";
import MediaLibrary from "@/pages/media-library";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/attractions" component={Attractions} />
      <Route path="/attractions/new" component={ContentEditor} />
      <Route path="/attractions/:id" component={ContentEditor} />
      <Route path="/hotels" component={Hotels} />
      <Route path="/hotels/new" component={ContentEditor} />
      <Route path="/hotels/:id" component={ContentEditor} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/new" component={ContentEditor} />
      <Route path="/articles/:id" component={ContentEditor} />
      <Route path="/rss-feeds" component={RssFeeds} />
      <Route path="/affiliate-links" component={AffiliateLinks} />
      <Route path="/media" component={MediaLibrary} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <header className="flex items-center justify-between gap-4 p-3 border-b sticky top-0 z-50 bg-background">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto p-6">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
