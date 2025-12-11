import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Database, Key, Globe, Bell, Shield } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your CMS configuration</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Site Settings</CardTitle>
            </div>
            <CardDescription>Configure your website details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                defaultValue="Dubai Travel Guide"
                placeholder="Your site name"
                data-testid="input-site-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-url">Site URL</Label>
              <Input
                id="site-url"
                defaultValue="https://dubaitravelguide.com"
                placeholder="https://example.com"
                data-testid="input-site-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-language">Default Language</Label>
              <Input
                id="default-language"
                defaultValue="English"
                placeholder="English"
                data-testid="input-default-language"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">API Configuration</CardTitle>
            </div>
            <CardDescription>Manage API keys and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                disabled
                data-testid="input-openai-key"
              />
              <p className="text-xs text-muted-foreground">
                OpenAI is configured via Replit AI Integrations
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="gyg-key">GetYourGuide Affiliate ID</Label>
              <Input
                id="gyg-key"
                placeholder="Your affiliate ID"
                data-testid="input-gyg-key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-key">Booking.com Affiliate ID</Label>
              <Input
                id="booking-key"
                placeholder="Your affiliate ID"
                data-testid="input-booking-key"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Content Settings</CardTitle>
            </div>
            <CardDescription>Configure content creation defaults</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-generate slugs</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate URL slugs from titles
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-auto-slug" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save drafts</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save content while editing
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-auto-save" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI content suggestions</Label>
                <p className="text-sm text-muted-foreground">
                  Show AI-powered writing suggestions
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-ai-suggestions" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails for content updates
                </p>
              </div>
              <Switch data-testid="switch-email-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Browser notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show browser push notifications
                </p>
              </div>
              <Switch data-testid="switch-browser-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Security</CardTitle>
            </div>
            <CardDescription>Manage security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-factor authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add extra security to your account
                </p>
              </div>
              <Switch data-testid="switch-2fa" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log out after inactivity
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-session-timeout" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} data-testid="button-save-settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
