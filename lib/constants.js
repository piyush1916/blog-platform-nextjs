export const TOKEN_STORAGE_KEY = "nebula-blog-token";
export const LIKED_POSTS_STORAGE_KEY = "nebula-liked-posts";
export const POSTS_PER_PAGE = 10;

export const BLOG_CATEGORIES = ["All", "Technology", "Design", "Web Dev", "AI"];

export const CATEGORY_STYLES = {
  Technology: {
    accent: "linear-gradient(90deg, #6c3fff, #38bdf8)",
    background: "rgba(108,63,255,0.2)",
    color: "#a78bfa",
  },
  Design: {
    accent: "linear-gradient(90deg, #f472b6, #fb923c)",
    background: "rgba(244,114,182,0.2)",
    color: "#f9a8d4",
  },
  "Web Dev": {
    accent: "linear-gradient(90deg, #38bdf8, #34d399)",
    background: "rgba(56,189,248,0.2)",
    color: "#7dd3fc",
  },
  AI: {
    accent: "linear-gradient(90deg, #a78bfa, #f472b6)",
    background: "rgba(167,139,250,0.2)",
    color: "#c4b5fd",
  },
};

export const DEFAULT_TOAST_STYLE = {
  background: "rgba(30,16,60,0.95)",
  border: "1px solid rgba(108,63,255,0.4)",
  color: "#c4b5fd",
  backdropFilter: "blur(16px)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.32)",
};

export const SUCCESS_TOAST_STYLE = {
  background: "rgba(16,40,30,0.95)",
  border: "1px solid rgba(52,211,153,0.4)",
  color: "#6ee7b7",
  backdropFilter: "blur(16px)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.32)",
};
