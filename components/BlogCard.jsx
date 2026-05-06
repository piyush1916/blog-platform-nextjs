import Link from "next/link";
import { Avatar, Button } from "@mui/material";
import { CATEGORY_STYLES } from "../lib/constants";
import { formatDisplayDate, getInitials } from "../lib/utils";

export default function BlogCard({ post, liked, pending, onLike }) {
  const categoryStyle = CATEGORY_STYLES[post.category];

  return (
    <article className="card-hover relative overflow-hidden rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-5">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: categoryStyle.accent }}
      />

      <div className="mb-4 flex items-center justify-between gap-3 pt-2">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "7px 16px",
            borderRadius: "999px",
            width: "fit-content",
            minWidth: "max-content",
            whiteSpace: "nowrap",
            lineHeight: 1,
            backgroundColor: categoryStyle.background,
            color: categoryStyle.color,
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {post.category}
        </span>
        <span className="text-xs text-[var(--text-faint)]">{post.likes + (liked ? 1 : 0)} likes</span>
      </div>

      <Link href={`/blog/${post.id}`} className="block">
        <h3 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
          {post.title}
        </h3>
        <p className="mb-5 text-xs leading-6 text-[var(--text-muted)]">{post.excerpt}</p>
      </Link>

      <div className="mb-5 flex items-center gap-3">
        <Avatar
          sx={{
            width: 26,
            height: 26,
            fontSize: 11,
            fontWeight: 700,
            color: "#ffffff",
            background: "linear-gradient(135deg, #6c3fff, #f472b6)",
          }}
        >
          {getInitials(post.author)}
        </Avatar>
        <div>
          <p className="text-xs font-medium text-[var(--text-soft)]">{post.author}</p>
          <p className="text-[11px] text-[var(--text-faint)]">{formatDisplayDate(post.date)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          onClick={() => onLike(post.id)}
          disabled={pending}
          variant="outlined"
          sx={{
            minWidth: 112,
            borderColor: "rgba(244,114,182,0.4)",
            backgroundColor: liked ? "rgba(244,114,182,0.1)" : "transparent",
            color: liked ? "#f472b6" : "#f3c3d9",
            "&:hover": {
              borderColor: "rgba(244,114,182,0.55)",
              backgroundColor: "rgba(244,114,182,0.14)",
            },
          }}
        >
          {pending ? "Saving..." : liked ? "Liked" : "Like"}
        </Button>

        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "rgba(108,63,255,0.3)",
            background: "rgba(108,63,255,0.1)",
            color: "#a78bfa",
          }}
        >
          Read story
        </Link>
      </div>
    </article>
  );
}
