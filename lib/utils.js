export function getInitials(value = "") {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "NN";
  }

  return parts.map((part) => part[0].toUpperCase()).join("");
}

export function formatDisplayDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getPasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: "Add a password to see strength",
      color: "#555577",
    };
  }

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const score = checks.filter(Boolean).length;

  if (score <= 1) {
    return { score: Math.max(score, 1), label: "Weak", color: "#ef4444" };
  }

  if (score === 2) {
    return { score, label: "Fair", color: "#fb923c" };
  }

  if (score === 3) {
    return { score, label: "Good", color: "#facc15" };
  }

  return { score, label: "Strong", color: "#34d399" };
}
