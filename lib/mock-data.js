import { createHmac } from "crypto";

const SECRET = "nebula-secret-key-2026";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24;
const globalForUsers = globalThis;

if (!globalForUsers.nebulaUsers) {
  globalForUsers.nebulaUsers = [];
}

const postSeeds = [
  {
    title: "Shipping AI copilots without losing product clarity",
    excerpt:
      "Design patterns for making AI assistants feel trustworthy, useful, and appropriately scoped.",
    category: "AI",
    author: "Maya Chen",
    date: "2026-05-05",
    likes: 184,
  },
  {
    title: "The case for motion systems in editorial interfaces",
    excerpt:
      "Why subtle motion rules make long-form reading experiences feel premium instead of noisy.",
    category: "Design",
    author: "Elliot Hart",
    date: "2026-05-05",
    likes: 132,
  },
  {
    title: "Building resilient route handlers in modern Next.js",
    excerpt:
      "A practical walkthrough for data shaping, auth guards, and response ergonomics in App Router APIs.",
    category: "Web Dev",
    author: "Ariana Fox",
    date: "2026-05-05",
    likes: 201,
  },
  {
    title: "Edge-ready typography choices that still feel human",
    excerpt:
      "How to pick expressive web fonts that keep dashboards, blogs, and docs from feeling generic.",
    category: "Design",
    author: "Sofia Turner",
    date: "2026-05-05",
    likes: 116,
  },
  {
    title: "Rethinking performance budgets for AI-heavy web apps",
    excerpt:
      "Model calls, optimistic UIs, and client caching all change how we think about perceived speed.",
    category: "Technology",
    author: "Jordan Lee",
    date: "2026-05-05",
    likes: 245,
  },
  {
    title: "A frontend architect's guide to local-first authentication",
    excerpt:
      "When tokens live in the browser, these are the UX and security tradeoffs teams need to understand.",
    category: "Web Dev",
    author: "Priya Nair",
    date: "2026-05-04",
    likes: 162,
  },
  {
    title: "Prompt libraries are becoming a real design artifact",
    excerpt:
      "Teams are treating prompt packs like reusable UI kits, and that changes review workflows.",
    category: "AI",
    author: "Noah Bennett",
    date: "2026-05-04",
    likes: 157,
  },
  {
    title: "Glassmorphism is back, but this time it learned restraint",
    excerpt:
      "A closer look at where translucent surfaces work best and where they quickly become visual debt.",
    category: "Design",
    author: "Lena Brooks",
    date: "2026-05-04",
    likes: 99,
  },
  {
    title: "How product teams are using query caches as UX infrastructure",
    excerpt:
      "React Query can do more than fetch data when you use it as a coordination layer for interface state.",
    category: "Technology",
    author: "Samir Patel",
    date: "2026-05-04",
    likes: 173,
  },
  {
    title: "The hidden cost of over-abstracted component APIs",
    excerpt:
      "Every extra prop feels helpful until your design system becomes harder to reason about than the app.",
    category: "Web Dev",
    author: "Harper Cole",
    date: "2026-05-04",
    likes: 141,
  },
  {
    title: "What AI product reviews can learn from editorial critique",
    excerpt:
      "The strongest reviews now evaluate voice, boundary setting, and confidence calibration alongside speed.",
    category: "AI",
    author: "Luca Rivera",
    date: "2026-05-03",
    likes: 189,
  },
  {
    title: "Designing blog cards that feel tactile on flat screens",
    excerpt:
      "Depth cues, highlight lines, and hover physics can add personality without hurting readability.",
    category: "Design",
    author: "Ava Morales",
    date: "2026-05-03",
    likes: 128,
  },
  {
    title: "When should you invalidate versus patch a query cache?",
    excerpt:
      "A practical mental model for choosing between precision updates and broad refetches.",
    category: "Technology",
    author: "Micah Woods",
    date: "2026-05-03",
    likes: 222,
  },
  {
    title: "Tuning search boxes for intent, not just filtering",
    excerpt:
      "Even small search affordances can change how quickly readers feel oriented inside a content-heavy app.",
    category: "Web Dev",
    author: "Grace Kim",
    date: "2026-05-03",
    likes: 109,
  },
  {
    title: "AI summaries are useful, but only when the source still matters",
    excerpt:
      "Readers trust summaries more when products make the original structure and authorship easy to recover.",
    category: "AI",
    author: "Daniel Ross",
    date: "2026-05-02",
    likes: 214,
  },
  {
    title: "Color systems for dark UIs that avoid muddy contrast",
    excerpt:
      "A set of contrast rules for saturated accents, frosted surfaces, and muted supporting text.",
    category: "Design",
    author: "Nina Alvarez",
    date: "2026-05-02",
    likes: 176,
  },
  {
    title: "Server components still need strong client boundaries",
    excerpt:
      "Modern React encourages better separation, but only if teams stay disciplined about browser-only logic.",
    category: "Web Dev",
    author: "Owen Price",
    date: "2026-05-02",
    likes: 193,
  },
  {
    title: "Why every content platform needs a faster empty state",
    excerpt:
      "Loading, no-results, and unauthorized states are part of the product voice whether teams plan for them or not.",
    category: "Technology",
    author: "Riya Das",
    date: "2026-05-02",
    likes: 97,
  },
  {
    title: "From prompt playgrounds to production workflows",
    excerpt:
      "The teams shipping reliable AI experiences are the ones treating prompts as versioned product assets.",
    category: "AI",
    author: "Ethan Clark",
    date: "2026-05-01",
    likes: 208,
  },
  {
    title: "Microcopy that makes sign-in flows feel confident",
    excerpt:
      "Subtle shifts in labels, hints, and error handling can remove friction before users even notice it.",
    category: "Design",
    author: "Chloe Martin",
    date: "2026-05-01",
    likes: 121,
  },
];

function buildParagraph(seed, angle) {
  return `${seed.title} sits at the intersection of ${seed.category.toLowerCase()} craft and product decision-making. ${angle} The teams that handle it best create a repeatable system around pacing, visual hierarchy, and implementation detail instead of relying on one-off intuition.`;
}

function buildContent(seed) {
  return [
    buildParagraph(
      seed,
      "In practice, that means giving people clear entry points, clear exits, and enough context to trust what happens next.",
    ),
    buildParagraph(
      seed,
      "The strongest interfaces make each layer legible on its own, whether that layer is layout, motion, copy, or data freshness.",
    ),
    buildParagraph(
      seed,
      "When product and engineering collaborate early, the end result feels intentional rather than assembled from separate decisions.",
    ),
  ].join("\n\n");
}

export const mockPosts = postSeeds.map((seed, index) => ({
  id: String(index + 1),
  ...seed,
  content: buildContent(seed),
}));

const users = globalForUsers.nebulaUsers;

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function signPayload(encoded) {
  return createHmac("sha256", SECRET)
    .update(encoded)
    .digest("base64url");
}

export function createToken(user) {
  const payload = {
    email: user.email,
    name: user.name,
    issuedAt: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

export function validateToken(token) {
  if (!token) return null;

  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const expected = signPayload(encoded);
    if (signature !== expected) return null;

    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    );

    if (Date.now() > payload.exp) return null;

    return users.find((user) => user.email === payload.email) ?? null;
  } catch {
    return null;
  }
}

export function validateAuthorizationHeader(headerValue) {
  if (!headerValue) {
    return null;
  }

  const token = headerValue.replace(/^Bearer\s+/i, "");
  return validateToken(token);
}

export function registerMockUser({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const existing = users.find((user) => user.email === normalizedEmail);

  if (existing) {
    return { error: "An account with this email already exists." };
  }

  users.push({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  return { message: "Account created successfully." };
}

export function loginMockUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const user = users.find(
    (candidate) =>
      candidate.email === normalizedEmail && candidate.password === password,
  );

  if (!user) {
    return { error: "Invalid email or password." };
  }

  return { token: createToken(user) };
}

export function getPaginatedPosts(page = 1, limit = 10) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const start = (safePage - 1) * safeLimit;
  const posts = mockPosts.slice(start, start + safeLimit);

  return {
    posts,
    total: mockPosts.length,
    page: safePage,
  };
}

export function getPostById(id) {
  return mockPosts.find((post) => post.id === id) ?? null;
}
