"use client";

import { useEffect, useSyncExternalStore } from "react";
import { CircularProgress } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authCheck } from "../lib/api";
import {
  clearToken,
  getToken,
  getUserFromToken,
  subscribeToBrowserState,
} from "../lib/auth";
import Navbar from "./Navbar";

function GuardStatus({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-card flex items-center gap-3 rounded-full px-6 py-4 text-sm text-[var(--text-muted)]">
        <CircularProgress size={18} sx={{ color: "var(--mui-palette-primary-main)" }} />
        <span>{message}</span>
      </div>
    </div>
  );
}

export default function ProtectedLayout({
  children,
  initialToken = "",
  initialUser = null,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(
    subscribeToBrowserState,
    getToken,
    () => initialToken,
  );
  const activeToken = token;

  useEffect(() => {
    if (!activeToken) {
      router.replace("/login");
    }
  }, [activeToken, router]);

  const authQuery = useQuery({
    queryKey: ["auth-check", activeToken],
    queryFn: () => authCheck(activeToken),
    enabled: Boolean(activeToken),
    initialData: activeToken ? { authenticated: true } : undefined,
    retry: false,
  });

  useEffect(() => {
    if (authQuery.data && !authQuery.data.authenticated) {
      clearToken();
      queryClient.invalidateQueries({ queryKey: ["auth-check"] });
      queryClient.removeQueries({ queryKey: ["posts"] });
      queryClient.removeQueries({ queryKey: ["post"] });
      queryClient.removeQueries({ queryKey: ["liked-posts"] });
      router.replace("/login");
    }
  }, [authQuery.data, queryClient, router]);

  useEffect(() => {
    if (authQuery.error) {
      clearToken();
      queryClient.invalidateQueries({ queryKey: ["auth-check"] });
      queryClient.removeQueries({ queryKey: ["posts"] });
      queryClient.removeQueries({ queryKey: ["post"] });
      queryClient.removeQueries({ queryKey: ["liked-posts"] });
      router.replace("/login");
    }
  }, [authQuery.error, queryClient, router]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    clearToken();
    await queryClient.invalidateQueries({ queryKey: ["auth-check"] });
    queryClient.removeQueries({ queryKey: ["posts"] });
    queryClient.removeQueries({ queryKey: ["post"] });
    queryClient.removeQueries({ queryKey: ["liked-posts"] });
    router.push("/login");
  }

  if (!activeToken) {
    return <GuardStatus message="Redirecting to login..." />;
  }

  if (authQuery.isPending) {
    return <GuardStatus message="Loading your stories..." />;
  }

  if (!authQuery.data?.authenticated) {
    return <GuardStatus message="Redirecting to login..." />;
  }

  const user = getUserFromToken(activeToken) || initialUser;

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
