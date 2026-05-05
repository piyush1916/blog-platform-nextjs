"use client";

import { useSyncExternalStore, useState } from "react";
import { Alert } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BLOG_CATEGORIES, POSTS_PER_PAGE } from "../lib/constants";
import {
  getLikedPostIds,
  getLikedPostsSnapshot,
  getToken,
  getUserFromToken,
  subscribeToBrowserState,
} from "../lib/auth";
import { fetchPosts, likePost } from "../lib/api";
import BlogCard from "./BlogCard";
import FilterChips from "./FilterChips";
import LoadingSkeleton from "./LoadingSkeleton";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

export default function BlogListScreen() {
  const token = useSyncExternalStore(
    subscribeToBrowserState,
    getToken,
    () => null,
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const user = getUserFromToken(token || "");
  const userEmail = user?.email || "guest";
  const filtersActive = search.trim().length > 0 || activeCategory !== "All";
  const requestPage = filtersActive ? 1 : page;
  const requestLimit = filtersActive ? 100 : POSTS_PER_PAGE;

  const postsQuery = useQuery({
    queryKey: ["posts", token, requestPage, requestLimit],
    queryFn: () => fetchPosts(token, { page: requestPage, limit: requestLimit }),
    enabled: Boolean(token),
    retry: false,
  });

  useSyncExternalStore(
    subscribeToBrowserState,
    () => getLikedPostsSnapshot(userEmail),
    () => "[]",
  );

  const likeMutation = useMutation({
    mutationFn: (postId) => likePost(postId, userEmail),
  });

  const allPosts = postsQuery.data?.posts ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const publishedToday = allPosts.filter((post) => post.date === today).length;
  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" ? true : post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const totalPages = filtersActive
    ? 1
    : Math.max(1, Math.ceil((postsQuery.data?.total ?? 0) / POSTS_PER_PAGE));
  const currentPage = filtersActive ? 1 : Math.min(page, totalPages);
  const paginatedPosts = filteredPosts;
  const likedPosts = getLikedPostIds(userEmail);

  return (
    <section className="space-y-8">
      <div className="space-y-5">
        <span className="inline-flex rounded-full border border-[rgba(108,63,255,0.25)] bg-[rgba(108,63,255,0.2)] px-4 py-2 text-sm font-semibold text-[#a78bfa]">
          {publishedToday} stories published today
        </span>
        <div className="space-y-3">
          <h1 className="hero-gradient font-[var(--font-space-grotesk)] text-[32px] font-extrabold leading-tight">
            Discover sharp stories across design, AI, and the modern web.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
            A curated reading flow with glass surfaces, fast filtering, and rich
            post detail pages built on top of protected Next.js route handlers.
          </p>
        </div>
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <FilterChips
          categories={BLOG_CATEGORIES}
          activeCategory={activeCategory}
          onSelect={(category) => {
            setActiveCategory(category);
            setPage(1);
          }}
        />
      </div>

      {postsQuery.isPending ? (
        <LoadingSkeleton count={6} />
      ) : null}

      {postsQuery.error ? (
        <Alert
          severity="error"
          sx={{
            borderRadius: "18px",
            backgroundColor: "rgba(244,114,182,0.1)",
            border: "1px solid rgba(244,114,182,0.2)",
            color: "#fbcfe8",
            "& .MuiAlert-icon": {
              color: "#f472b6",
            },
          }}
        >
          {postsQuery.error.message}
        </Alert>
      ) : null}

      {!postsQuery.isPending && !postsQuery.error && paginatedPosts.length === 0 ? (
        <div className="glass-card rounded-[20px] px-6 py-10 text-center">
          <p className="text-base font-semibold text-[var(--text-primary)]">
            No stories match that search yet.
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Try another title keyword or switch back to the All filter.
          </p>
        </div>
      ) : null}

      {!postsQuery.isPending && !postsQuery.error && paginatedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              liked={likedPosts.includes(post.id)}
              pending={likeMutation.isPending && likeMutation.variables === post.id}
              onLike={(postId) => likeMutation.mutate(postId)}
            />
          ))}
        </div>
      ) : null}

      {!postsQuery.isPending && !postsQuery.error ? (
        <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
      ) : null}
    </section>
  );
}
