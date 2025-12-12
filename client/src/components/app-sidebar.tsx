import { Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  FileText,
  Rss,
  Link2,
  Image,
  Settings,
  UtensilsCrossed,
  Map,
  Train,
  Sparkles,
  Lightbulb,
  Search,
  Users,
  LogOut,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import type { User } from "@/hooks/use-auth";
import { Mascot } from "@/components/logo";

const contentItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Attractions",
    url: "/admin/attractions",
    icon: MapPin,
  },
  {
    title: "Hotels",
    url: "/admin/hotels",
    icon: Building2,
  },
  {
    title: "Dining",
    url: "/admin/dining",
    icon: UtensilsCrossed,
  },
  {
    title: "Districts",
    url: "/admin/districts",
    icon: Map,
  },
  {
    title: "Transport",
    url: "/admin/transport",
    icon: Train,
  },
  {
    title: "Articles",
    url: "/admin/articles",
    icon: FileText,
  },
];

const managementItems = [
  {
    title: "AI Generator",
    url: "/admin/ai-generator",
    icon: Sparkles,
  },
  {
    title: "Topic Bank",
    url: "/admin/topic-bank",
    icon: Lightbulb,
  },
  {
    title: "Keywords",
    url: "/admin/keywords",
    icon: Search,
  },
  {
    title: "RSS Feeds",
    url: "/admin/rss-feeds",
    icon: Rss,
  },
  {
    title: "Affiliate Links",
    url: "/admin/affiliate-links",
    icon: Link2,
  },
  {
    title: "Media Library",
    url: "/admin/media",
    icon: Image,
  },
];

const systemItems = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

interface AppSidebarProps {
  user?: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [location, setLocation] = useLocation();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/login");
    },
  });

  const isActive = (url: string) => {
    if (url === "/admin") return location === "/admin";
    return location.startsWith(url);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-3">
          <Mascot variant="light-bg" size={36} />
          <div className="flex flex-col">
            <span className="font-heading font-semibold text-sm">Travi CMS</span>
            <span className="text-xs text-muted-foreground">Dubai Travel</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.role === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/admin/users")}
                    data-testid="nav-users"
                  >
                    <Link href="/admin/users">
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-3">
        {user && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium truncate">{user.name || user.email}</span>
            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
