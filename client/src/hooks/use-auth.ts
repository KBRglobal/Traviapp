import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor" | "viewer";
  isActive: boolean;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useAuth(): AuthState {
  const { data, isLoading, error } = useQuery<{ user: User } | { user: null }>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
  };
}

export function useRequireAuth(redirectTo: string = "/login") {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation(redirectTo);
    }
  }, [isLoading, isAuthenticated, setLocation, redirectTo]);

  return { user, isLoading, isAuthenticated };
}
