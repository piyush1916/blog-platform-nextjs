"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Alert, Avatar, Button } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CATEGORY_STYLES, DEFAULT_TOAST_STYLE } from "../lib/constants";
import { fetchPost, likePost } from "../lib/api";
import {
  getLikedPostIds,
  getLikedPostsSnapshot,
  getToken,
  getUserFromToken,
  subscribeToBrowserState,
} from "../lib/auth";
import { formatDisplayDate, getInitials } from "../lib/utils";
import LoadingSkeleton from "./LoadingSkeleton";

export default function BlogDetailScreen({ postId }) {
  const token = useSyncExternalStore(
    subscribeToBrowserState,
    getToken,
    () => null,
  );
  const user = getUserFromToken(token || "");
  const userEmail = user?.email || "guest";

  const postQuery = useQuery({
    queryKey: ["post", postId, token],
    queryFn: () => fetchPost(token, postId),
    enabled: Boolean(token),
    retry: false,
  });

  useSyncExternalStore(
    subscribeToBrowserState,
    () => getLikedPostsSnapshot(userEmail),
    () => "[]",
  );

  const likedPosts = getLikedPostIds(userEmail);
  const liked = likedPosts.includes(postId);

  const likeMutation = useMutation({
    mutationFn: (id) => likePost(id, userEmail),
    onSuccess: (nextValue) => {
      const nextLiked = nextValue.includes(postId);
      toast.success(nextLiked ? "Story added to your likes." : "Story removed from your likes.", {
        className: "toast-rise",
        style: DEFAULT_TOAST_STYLE,
      });
    },
  });

  const post = postQuery.data;
  const paragraphs = post?.content ? post.content.split("\n\n") : [];

  if (postQuery.isPending) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (postQuery.error) {
    return (
      <div className="space-y-4">
        <Link
          href="/blog"
          className="inline-flex rounded-full border border-[rgba(108,63,255,0.2)] px-4 py-2 text-sm font-semibold text-[#a78bfa] transition-colors hover:bg-[rgba(108,63,255,0.12)]"
        >
          Back to stories
        </Link>
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
          {postQuery.error.message}
        </Alert>
      </div>
    );
  }

  const categoryStyle = CATEGORY_STYLES[post.category];

  return (
    <article className="glass-card rounded-[20px] border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/blog"
          className="inline-flex rounded-full border border-[rgba(108,63,255,0.2)] px-4 py-2 text-sm font-semibold text-[#a78bfa] transition-colors hover:bg-[rgba(108,63,255,0.12)]"
        >
          Back to stories
        </Link>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 16px",
            borderRadius: "999px",
            width: "auto",
            minWidth: "max-content",
            whiteSpace: "nowrap",
            backgroundColor: categoryStyle.background,
            color: categoryStyle.color,
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {post.category}
        </span>
      </div>

      <div className="mb-8 space-y-5">
        <h1 className="gradient-logo font-[var(--font-space-grotesk)] text-3xl font-extrabold leading-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-[var(--text-muted)]">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 34,
                height: 34,
                fontSize: 12,
                fontWeight: 700,
                color: "#ffffff",
                background: "linear-gradient(135deg, #6c3fff, #f472b6)",
              }}
            >
              {getInitials(post.author)}
            </Avatar>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{post.author}</p>
              <p className="text-xs text-[var(--text-faint)]">{formatDisplayDate(post.date)}</p>
            </div>
          </div>
          <span className="rounded-full border border-white/8 px-3 py-1 text-xs text-[var(--text-faint)]">
            {post.likes + (liked ? 1 : 0)} likes
          </span>
        </div>
      </div>

      <div className="detail-content mb-10">
        {paragraphs.map((paragraph, index) => (
          <p key={`${post.id}-${index}`}>{paragraph}</p>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => likeMutation.mutate(post.id)}
          disabled={likeMutation.isPending}
          sx={{
            minWidth: 220,
            borderRadius: "999px",
            px: 4,
            py: 1.6,
            border: "1px solid rgba(244,114,182,0.4)",
            backgroundColor: liked ? "rgba(244,114,182,0.16)" : "rgba(255,255,255,0.02)",
            color: liked ? "#f472b6" : "#f7d1e2",
            "&:hover": {
              backgroundColor: "rgba(244,114,182,0.18)",
              borderColor: "rgba(244,114,182,0.55)",
            },
          }}
        >
          {likeMutation.isPending ? "Updating..." : liked ? "Liked story" : "Like this story"}
        </Button>
      </div>
    </article>
  );
}
