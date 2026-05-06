import { POSTS_PER_PAGE } from "./constants";
import { authHeaders, toggleLikedPostId } from "./auth";

async function request(path, { method = "GET", token, body } = {}) {
  const response = await fetch(path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(token),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export function registerUser(payload) {
  return request("/api/register", {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload) {
  return request("/api/login", {
    method: "POST",
    body: payload,
  });
}

export function authCheck(token) {
  return request("/api/auth-check", { token });
}

export function fetchPosts(token, { page = 1, limit = POSTS_PER_PAGE } = {}) {
  return request(`/api/posts?page=${page}&limit=${limit}`, { token });
}

export function fetchPost(token, id) {
  return request(`/api/posts/${id}`, { token });
}

export function likePost(postId, email) {
  return Promise.resolve(toggleLikedPostId(postId, email));
}
