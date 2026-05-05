"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { registerUser } from "../../../lib/api";
import { getToken, subscribeToBrowserState } from "../../../lib/auth";
import { SUCCESS_TOAST_STYLE } from "../../../lib/constants";
import { getPasswordStrength } from "../../../lib/utils";

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 52,
    borderRadius: "14px",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#e0e0ff",
    display: "flex",
    alignItems: "center",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.16)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(108,63,255,0.6)",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "15px 18px",
    fontSize: "14px",
    lineHeight: 1.4,
  },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "#555577",
    opacity: 1,
  },
  "& .MuiFormHelperText-root": {
    color: "#f472b6",
    fontSize: "11px",
    marginLeft: 0,
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const token = useSyncExternalStore(
    subscribeToBrowserState,
    getToken,
    () => null,
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    if (token) {
      router.replace("/blog");
    }
  }, [router, token]);

  const passwordStrength = getPasswordStrength(form.password);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message, {
        className: "toast-rise",
        style: SUCCESS_TOAST_STYLE,
      });
      router.replace("/login");
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

  function isFieldActive(field) {
    return focusedField === field || Boolean(form[field]);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      name: form.name ? "" : "Full name is required.",
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email address.",
      password: form.password.length >= 8 ? "" : "Password must be at least 8 characters.",
      confirmPassword:
        form.confirmPassword === form.password
          ? ""
          : "Passwords must match.",
    };

    setErrors(nextErrors);

    if (
      nextErrors.name ||
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirmPassword
    ) {
      return;
    }

    mutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  }

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.confirmPassword === form.password;

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
          <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">Create account</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Set up your profile to unlock the protected reading experience.
          </p>
        </div>

        <div className="space-y-4">
          <div className="auth-input-group">
            <label
              htmlFor="register-name"
              className={`auth-input-label ${isFieldActive("name") ? "auth-input-label--active" : ""}`}
            >
              Full name
            </label>
            <TextField
              id="register-name"
              placeholder="Enter your full name"
              fullWidth
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField("")}
              error={Boolean(errors.name)}
              helperText={errors.name || " "}
              slotProps={{ htmlInput: { "aria-label": "Full name" } }}
              sx={inputStyles}
            />
          </div>

          <div className="auth-input-group">
            <label
              htmlFor="register-email"
              className={`auth-input-label ${isFieldActive("email") ? "auth-input-label--active" : ""}`}
            >
              Email
            </label>
            <TextField
              id="register-email"
              type="email"
              placeholder="Enter your email"
              fullWidth
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              error={Boolean(errors.email)}
              helperText={errors.email || " "}
              slotProps={{ htmlInput: { "aria-label": "Email" } }}
              sx={inputStyles}
            />
          </div>

          <div>
            <div className="auth-input-group">
              <label
                htmlFor="register-password"
                className={`auth-input-label ${isFieldActive("password") ? "auth-input-label--active" : ""}`}
              >
                Password
              </label>
              <TextField
                id="register-password"
                type="password"
                placeholder="Enter your password"
                fullWidth
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                error={Boolean(errors.password)}
                helperText={errors.password || " "}
                slotProps={{ htmlInput: { "aria-label": "Password" } }}
                sx={inputStyles}
              />
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <span
                  key={index}
                  className="block h-[3px] rounded-[4px]"
                  style={{
                    backgroundColor:
                      index < passwordStrength.score
                        ? passwordStrength.color
                        : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-[11px]" style={{ color: passwordStrength.color }}>
              {passwordStrength.label}
            </p>
          </div>

          <div>
            <div className="auth-input-group">
              <label
                htmlFor="register-confirm-password"
                className={`auth-input-label ${isFieldActive("confirmPassword") ? "auth-input-label--active" : ""}`}
              >
                Confirm password
              </label>
              <TextField
                id="register-confirm-password"
                type="password"
                placeholder="Confirm your password"
                fullWidth
                value={form.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField("")}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword || " "}
                slotProps={{ htmlInput: { "aria-label": "Confirm password" } }}
                sx={inputStyles}
              />
            </div>
            {passwordsMatch ? (
              <p className="mt-1 text-[11px] text-[#34d399]">Passwords match.</p>
            ) : null}
          </div>
        </div>

        {formError ? <p className="mb-4 text-[11px] text-[#f472b6]">{formError}</p> : null}

        <Button
          type="submit"
          fullWidth
          disabled={mutation.isPending}
          sx={{
            mt: 1,
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
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-[#6c3fff]">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
