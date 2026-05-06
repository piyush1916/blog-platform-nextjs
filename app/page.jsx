"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getToken, subscribeToBrowserState } from "../lib/auth";

export default function HomePage() {
  const router = useRouter();
  const token = useSyncExternalStore(
    subscribeToBrowserState,
    getToken,
    () => null,
  );

  useEffect(() => {
    if (token === null) {
      return;
    }

    router.replace(token ? "/blog" : "/login");
  }, [router, token]);

  return null;
}
