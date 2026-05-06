import { LIKED_POSTS_STORAGE_KEY, TOKEN_STORAGE_KEY } from "./constants";
import { getInitials } from "./utils";

const AUTH_SYNC_STORAGE_KEY = `${TOKEN_STORAGE_KEY}-sync`;
const BROWSER_STATE_EVENT = "nebula-browser-state-change";

export function isBrowser() {
  return typeof window !== "undefined";
}

function notifyBrowserStateChange(syncKey) {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(BROWSER_STATE_EVENT));

  if (!syncKey) {
    return;
  }

  try {
    localStorage.setItem(syncKey, String(Date.now()));
  } catch {
    // Ignore sync marker errors.
  }
}

export function subscribeToBrowserState(onStoreChange) {
  if (!isBrowser()) {
    return () => {};
  }

  function handleStorage(event) {
    if (
      !event.key ||
      event.key === AUTH_SYNC_STORAGE_KEY ||
      event.key.startsWith(LIKED_POSTS_STORAGE_KEY)
    ) {
      onStoreChange();
    }
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(BROWSER_STATE_EVENT, onStoreChange);
  window.addEventListener("focus", onStoreChange);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(BROWSER_STATE_EVENT, onStoreChange);
    window.removeEventListener("focus", onStoreChange);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}

export function getToken() {
  if (!isBrowser()) {
    return "";
  }

  return document.cookie
    .split("; ")
    .find((item) => item.startsWith(TOKEN_STORAGE_KEY + "="))
    ?.split("=")[1] ?? "";
}

export function setToken(token) {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${TOKEN_STORAGE_KEY}=${token}; path=/; max-age=86400; SameSite=Strict`;
  notifyBrowserStateChange(AUTH_SYNC_STORAGE_KEY);
}

export function clearToken() {
  if (!isBrowser()) {
    return;
  }
  document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; max-age=0`;
  notifyBrowserStateChange(AUTH_SYNC_STORAGE_KEY);
}

function normalizeBase64(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;

  if (padding === 0) {
    return normalized;
  }

  return normalized.padEnd(normalized.length + (4 - padding), "=");
}

function getEncodedTokenPart(token) {
  if (!token) {
    return "";
  }

  const parts = token.split(".");

  if (parts.length === 3 && parts[0] === "nebula") {
    return parts[1];
  }

  if (parts.length === 2) {
    return parts[0];
  }

  return "";
}

export function decodeToken(token) {
  const encoded = getEncodedTokenPart(token);

  if (!encoded) {
    return null;
  }

  try {
    const decoded = JSON.parse(atob(normalizeBase64(encoded)));
    if (!decoded?.email) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function getUserFromToken(token = getToken()) {
  const payload = decodeToken(token);

  if (!payload) {
    return null;
  }

  return {
    name: payload.name,
    email: payload.email,
    initials: getInitials(payload.name || payload.email),
  };
}

export function authHeaders(token = getToken()) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getLikedPostsSnapshot(email = "guest") {
  if (!isBrowser()) return "[]";

  const raw = localStorage.getItem(`${LIKED_POSTS_STORAGE_KEY}_${email}`);
  return raw || "[]";
}

export function getLikedPostIds(email = "guest") {
  try {
    const parsed = JSON.parse(getLikedPostsSnapshot(email));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setLikedPostIds(postIds, email = "guest") {
  if (!isBrowser()) return;
  localStorage.setItem(`${LIKED_POSTS_STORAGE_KEY}_${email}`, JSON.stringify(postIds));
  notifyBrowserStateChange();
}

export function toggleLikedPostId(postId, email = "guest") {
  const current = new Set(getLikedPostIds(email));
  if (current.has(postId)) {
    current.delete(postId);
  } else {
    current.add(postId);
  }
  const nextValue = Array.from(current);
  setLikedPostIds(nextValue, email);
  return nextValue;
}

export function clearLikedPosts(email = "guest") {
  if (!isBrowser()) return;
  localStorage.removeItem(`${LIKED_POSTS_STORAGE_KEY}_${email}`);
  notifyBrowserStateChange();
}
