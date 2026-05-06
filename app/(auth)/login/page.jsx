"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../lib/api";
import { getToken, setToken, subscribeToBrowserState } from "../../../lib/auth";
import { DEFAULT_TOAST_STYLE } from "../../../lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(
    subscribeToBrowserState,
    getToken,
    () => null,
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (token) {
      router.replace("/blog");
    }
  }, [router, token]);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      setToken(data.token);
      await queryClient.invalidateQueries({ queryKey: ["auth-check"] });
      toast.success("Welcome back to Nebula Notes.", {
        className: "toast-rise",
        style: DEFAULT_TOAST_STYLE,
      });
      router.replace("/blog");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFormError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      email: form.email
        ? /\S+@\S+\.\S+/.test(form.email)
          ? ""
          : "Enter a valid email address."
        : "Email is required.",
      password: form.password ? "" : "Password is required.",
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    mutation.mutate(form);
  }

  if (token === null) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="auth-card text-center">
          <p className="gradient-logo mb-3 font-[var(--font-space-grotesk)] text-3xl font-bold">
            Nebula Notes
          </p>
          <p className="text-sm text-[var(--text-muted)]">Checking your session...</p>
        </div>
      </main>
    );
  }

  if (token) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="auth-card text-center">
          <p className="gradient-logo mb-3 font-[var(--font-space-grotesk)] text-3xl font-bold">
            Nebula Notes
          </p>
          <p className="text-sm text-[var(--text-muted)]">Redirecting to your stories...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="mb-8 text-center">
          <p className="gradient-logo mb-3 font-[var(--font-space-grotesk)] text-3xl font-bold">
            Nebula Notes
          </p>
          <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Sign in to continue reading your protected story feed.
          </p>
        </div>

        <div className="space-y-2">

          {/* Email */}
          <div className="float-field">
            <input
              id="login-email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              autoComplete="email"
              className={errors.email ? "input-error" : ""}
            />
            <label htmlFor="login-email">Email</label>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="float-field">
            <input
              id="login-password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              autoComplete="current-password"
              className={errors.password ? "input-error" : ""}
            />
            <label htmlFor="login-password">Password</label>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

        </div>

        <div className="mb-4 mt-1 text-right">
          <a
            href="mailto:support@nebulanotes.dev?subject=Password%20reset"
            className="text-sm font-medium text-[#6c3fff]"
          >
            Forgot password?
          </a>
        </div>

        {formError ? <p className="mb-4 text-[11px] text-[#f472b6]">{formError}</p> : null}

        <Button
          type="submit"
          fullWidth
          disabled={mutation.isPending}
          sx={{
            minHeight: 48,
            borderRadius: "12px",
            color: "#ffffff",
            background: "linear-gradient(90deg, #6c3fff, #38bdf8)",
            "&:hover": {
              background: "linear-gradient(90deg, #5c35d6, #2ea7d7)",
            },
          }}
        >
          {mutation.isPending ? (
            <span className="inline-flex items-center gap-2">
              <CircularProgress size={18} sx={{ color: "#ffffff" }} />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Need an account?{" "}
          <Link href="/register" className="font-semibold text-[#6c3fff]">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
