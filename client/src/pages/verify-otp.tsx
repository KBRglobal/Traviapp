import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2, ArrowLeft } from "lucide-react";

const otpSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyOtp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem("pendingAuthEmail");
    if (!pendingEmail) {
      setLocation("/login");
      return;
    }
    setEmail(pendingEmail);
  }, [setLocation]);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: OtpFormData) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", {
        email,
        code: data.code,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        sessionStorage.removeItem("pendingAuthEmail");
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully",
        });
        setLocation("/admin");
      } else {
        toast({
          title: "Verification failed",
          description: data.message || "Invalid or expired code",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/request-otp", { email });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Code resent",
          description: "Check your email for the new verification code",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to resend code",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resend verification code",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OtpFormData) => {
    verifyOtpMutation.mutate(data);
  };

  const handleResend = () => {
    resendOtpMutation.mutate();
  };

  const handleBack = () => {
    sessionStorage.removeItem("pendingAuthEmail");
    setLocation("/login");
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="000000"
                          className="pl-10 text-center text-2xl tracking-widest"
                          maxLength={6}
                          data-testid="input-otp"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={verifyOtpMutation.isPending}
                data-testid="button-verify"
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              data-testid="button-resend"
            >
              {resendOtpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleBack}
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Use different email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
