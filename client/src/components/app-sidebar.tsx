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
  Home,
  BarChart3,
  ClipboardList,
  Mail,
  Send,
  Calendar,
  Route,
  Network,
  Tags,
  Languages,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import type { User } from "@/hooks/use-auth";
import { Mascot } from "@/components/logo";

type PermissionKey = 
  | "canCreate" | "canEdit" | "canEditOwn" | "canDelete" | "canPublish" 
  | "canSubmitForReview" | "canManageUsers" | "canManageSettings" 
  | "canViewAnalytics" | "canViewAuditLogs" | "canAccessMediaLibrary" 
  | "canAccessAffiliates" | "canViewAll";

interface PermissionsResponse {
  role?: string;
  permissions?: {
    [key: string]: boolean;
  };
  // Also support flat permissions for backward compatibility
  [key: string]: boolean | string | { [key: string]: boolean } | undefined;
}

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
  {
    title: "Events",
    url: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Itineraries",
    url: "/admin/itineraries",
    icon: Route,
  },
];

const managementItems: Array<{
  title: string;
  url: string;
  icon: typeof Home;
  requiredPermission?: PermissionKey;
}> = [
  {
    title: "Homepage",
    url: "/admin/homepage-promotions",
    icon: Home,
    requiredPermission: "canPublish",
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
    requiredPermission: "canViewAnalytics",
  },
  {
    title: "Newsletter",
    url: "/admin/newsletter",
    icon: Mail,
    requiredPermission: "canViewAnalytics",
  },
  {
    title: "Campaigns",
    url: "/admin/campaigns",
    icon: Send,
    requiredPermission: "canViewAnalytics",
  },
  {
    title: "AI Generator",
    url: "/admin/ai-generator",
    icon: Sparkles,
    requiredPermission: "canCreate",
  },
  {
    title: "Topic Bank",
    url: "/admin/topic-bank",
    icon: Lightbulb,
    requiredPermission: "canCreate",
  },
  {
    title: "Keywords",
    url: "/admin/keywords",
    icon: Search,
    requiredPermission: "canCreate",
  },
  {
    title: "Clusters",
    url: "/admin/clusters",
    icon: Network,
    requiredPermission: "canCreate",
  },
  {
    title: "Tags",
    url: "/admin/tags",
    icon: Tags,
    requiredPermission: "canCreate",
  },
  {
    title: "RSS Feeds",
    url: "/admin/rss-feeds",
    icon: Rss,
    requiredPermission: "canCreate",
  },
  {
    title: "Affiliate Links",
    url: "/admin/affiliate-links",
    icon: Link2,
    requiredPermission: "canAccessAffiliates",
  },
  {
    title: "Media Library",
    url: "/admin/media",
    icon: Image,
    requiredPermission: "canAccessMediaLibrary",
  },
  {
    title: "Translations",
    url: "/admin/translations",
    icon: Languages,
    requiredPermission: "canManageSettings",
  },
];

const systemItems: Array<{
  title: string;
  url: string;
  icon: typeof Settings;
  requiredPermission?: PermissionKey;
}> = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    requiredPermission: "canManageSettings",
  },
  {
    title: "Audit Logs",
    url: "/admin/audit-logs",
    icon: ClipboardList,
    requiredPermission: "canViewAuditLogs",
  },
];

interface AppSidebarProps {
  user?: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [location, setLocation] = useLocation();

  // Fetch user permissions
  const { data: permissionsResponse, isLoading: permissionsLoading } = useQuery<PermissionsResponse>({
    queryKey: ["/api/user/permissions"],
    enabled: !!user,
  });

  // Helper to check permission - handles both nested { role, permissions: {...} } and flat {...} formats
  const hasPermission = (permission: PermissionKey): boolean => {
    if (!permissionsResponse) return false;
    // First check nested permissions object (current API format)
    if (permissionsResponse.permissions?.[permission] !== undefined) {
      return permissionsResponse.permissions[permission] === true;
    }
    // Fallback to flat permissions for backward compatibility
    return permissionsResponse[permission] === true;
  };

  // Filter management items based on permissions (hide restricted items while loading for security)
  const visibleManagementItems = permissionsLoading 
    ? managementItems.filter((item) => !item.requiredPermission) // Only show items without permission requirements while loading
    : managementItems.filter((item) => {
        if (!item.requiredPermission) return true;
        return hasPermission(item.requiredPermission);
      });

  // Filter system items based on permissions (hide restricted items while loading for security)
  const visibleSystemItems = permissionsLoading
    ? systemItems.filter((item) => !item.requiredPermission) // Only show items without permission requirements while loading
    : systemItems.filter((item) => {
        if (!item.requiredPermission) return true;
        return hasPermission(item.requiredPermission);
      });

  // Check if user can manage users (hide while loading for security)
  const canManageUsers = !permissionsLoading && hasPermission("canManageUsers");

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

        {visibleManagementItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleManagementItems.map((item) => (
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
        )}

        {(visibleSystemItems.length > 0 || canManageUsers) && (
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleSystemItems.map((item) => (
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
                {canManageUsers && (
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
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-3">
        {user && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium truncate">{user.firstName || user.email}</span>
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
