"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import theme from "../styles/theme";
import { DEFAULT_TOAST_STYLE } from "../lib/constants";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            // TanStack Query v5 renamed cacheTime to gcTime.
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: true,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-center"
          gutter={12}
          toastOptions={{
            duration: 2600,
            className: "toast-rise",
            style: DEFAULT_TOAST_STYLE,
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
