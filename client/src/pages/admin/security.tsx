import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Shield,
  Key,
  Lock,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  History,
  Users,
  Settings,
  RefreshCw,
} from "lucide-react";

interface SecurityStatus {
  twoFactorEnabled: boolean;
  lastPasswordChange: string | null;
  activeSessions: number;
  recentLoginAttempts: number;
  failedLoginAttempts: number;
}

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  success: boolean;
}

export default function SecurityPage() {
  const { toast } = useToast();
  const [showQRCode, setShowQRCode] = useState(false);

  const { data: status, isLoading: statusLoading } = useQuery<SecurityStatus>({
    queryKey: ["/api/security/status"],
  });

  const { data: sessions } = useQuery<{ sessions: Session[] }>({
    queryKey: ["/api/security/sessions"],
  });

  const { data: logs } = useQuery<{ logs: SecurityLog[] }>({
    queryKey: ["/api/security/logs"],
  });

  const enable2FAMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/security/2fa/enable"),
    onSuccess: () => {
      toast({ title: "2FA setup initiated", description: "Scan the QR code with your authenticator app" });
      setShowQRCode(true);
      queryClient.invalidateQueries({ queryKey: ["/api/security"] });
    },
    onError: () => toast({ title: "Failed to enable 2FA", variant: "destructive" }),
  });

  const disable2FAMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/security/2fa/disable"),
    onSuccess: () => {
      toast({ title: "2FA disabled" });
      queryClient.invalidateQueries({ queryKey: ["/api/security"] });
    },
    onError: () => toast({ title: "Failed to disable 2FA", variant: "destructive" }),
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => apiRequest("POST", `/api/security/sessions/${sessionId}/revoke`),
    onSuccess: () => {
      toast({ title: "Session revoked" });
      queryClient.invalidateQueries({ queryKey: ["/api/security/sessions"] });
    },
    onError: () => toast({ title: "Failed to revoke session", variant: "destructive" }),
  });

  if (statusLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Security Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage two-factor authentication, sessions, and security preferences
        </p>
      </div>

      {status?.failedLoginAttempts && status.failedLoginAttempts > 3 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription>
            There have been {status.failedLoginAttempts} failed login attempts recently.
            Consider enabling 2FA if you haven't already.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              2FA Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={status?.twoFactorEnabled ? "default" : "secondary"}
              className="text-sm"
              data-testid="badge-2fa-status"
            >
              {status?.twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-sessions">
              {status?.activeSessions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Recent Logins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-recent-logins">
              {status?.recentLoginAttempts || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Failed Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-failed-attempts">
              {status?.failedLoginAttempts || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="2fa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="2fa" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Two-Factor Auth
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Users className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <History className="h-4 w-4" />
            Security Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="2fa">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account using an authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${status?.twoFactorEnabled ? "bg-green-100 dark:bg-green-900" : "bg-muted"}`}>
                    <Shield className={`h-6 w-6 ${status?.twoFactorEnabled ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h4 className="font-medium">Authenticator App</h4>
                    <p className="text-sm text-muted-foreground">
                      Use Google Authenticator, Authy, or similar apps
                    </p>
                  </div>
                </div>
                <Button
                  variant={status?.twoFactorEnabled ? "outline" : "default"}
                  onClick={() =>
                    status?.twoFactorEnabled
                      ? disable2FAMutation.mutate()
                      : enable2FAMutation.mutate()
                  }
                  disabled={enable2FAMutation.isPending || disable2FAMutation.isPending}
                  data-testid="button-toggle-2fa"
                >
                  {status?.twoFactorEnabled ? "Disable" : "Enable"}
                </Button>
              </div>

              {showQRCode && (
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertTitle>Scan this QR code</AlertTitle>
                  <AlertDescription>
                    Use your authenticator app to scan the QR code, then enter the verification code.
                  </AlertDescription>
                  <div className="mt-4 space-y-4">
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">QR Code Placeholder</p>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Enter 6-digit code" maxLength={6} data-testid="input-2fa-code" />
                      <Button data-testid="button-verify-2fa">Verify</Button>
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage devices and browsers currently logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {sessions?.sessions && sessions.sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                        data-testid={`session-item-${session.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <Lock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {session.device}
                              {session.isCurrent && (
                                <Badge variant="outline" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {session.location} • Last active: {new Date(session.lastActive).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => revokeSessionMutation.mutate(session.id)}
                            disabled={revokeSessionMutation.isPending}
                            data-testid={`button-revoke-${session.id}`}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active sessions found</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Security Logs
              </CardTitle>
              <CardDescription>
                Recent security-related events on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {logs?.logs && logs.logs.length > 0 ? (
                  <div className="space-y-2">
                    {logs.logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        data-testid={`log-item-${log.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {log.success ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()} • IP: {log.ip}
                            </p>
                          </div>
                        </div>
                        <Badge variant={log.success ? "outline" : "destructive"}>
                          {log.success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No security logs available</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
