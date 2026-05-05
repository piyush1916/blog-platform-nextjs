"use client";

import Link from "next/link";
import { Avatar, Button } from "@mui/material";
import { usePathname } from "next/navigation";

export default function Navbar({ user, onLogout }) {
  const pathname = usePathname();

  const navLinks = [{ href: "/blog", label: "Stories" }];

  if (pathname.startsWith("/blog/")) {
    navLinks.push({ href: pathname, label: "Article" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-white/3 backdrop-blur-[12px]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="gradient-logo font-[var(--font-space-grotesk)] text-xl font-bold tracking-tight"
        >
          Nebula Notes
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  borderColor: active
                    ? "rgba(108,63,255,0.3)"
                    : "rgba(255,255,255,0.08)",
                  background: active
                    ? "linear-gradient(90deg, rgba(108,63,255,0.3), rgba(56,189,248,0.3))"
                    : "transparent",
                  color: active ? "#c4b5fd" : "#6e6e9a",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {user?.name || "Reader"}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
          </div>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: 13,
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(135deg, #6c3fff, #f472b6)",
            }}
          >
            {user?.initials || "NN"}
          </Avatar>
          <Button
            onClick={onLogout}
            variant="outlined"
            sx={{
              borderRadius: "999px",
              borderColor: "rgba(108,63,255,0.3)",
              color: "#a78bfa",
              px: 2,
              "&:hover": {
                borderColor: "rgba(108,63,255,0.5)",
                backgroundColor: "rgba(108,63,255,0.1)",
              },
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
