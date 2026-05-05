import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogListScreen from "../components/BlogListScreen";

const mockFetchPosts = vi.fn();
const mockLikePost = vi.fn();
const mockGetToken = vi.fn();
const mockGetUserFromToken = vi.fn();
const mockGetLikedPostIds = vi.fn();

vi.mock("../lib/api", () => ({
  fetchPosts: (...args) => mockFetchPosts(...args),
  likePost: (...args) => mockLikePost(...args),
}));

vi.mock("../lib/auth", () => ({
  getToken: () => mockGetToken(),
  getUserFromToken: (...args) => mockGetUserFromToken(...args),
  getLikedPostIds: (...args) => mockGetLikedPostIds(...args),
  getLikedPostsSnapshot: (...args) =>
    JSON.stringify(mockGetLikedPostIds(...args)),
  subscribeToBrowserState: () => () => {},
}));

vi.mock("../components/LoadingSkeleton", () => ({
  default: () => <div>Loading stories...</div>,
}));

vi.mock("../components/BlogCard", () => ({
  default: function MockBlogCard({ post, liked, onLike }) {
    return (
      <div>
        <h2>{post.title}</h2>
        <p>{post.category}</p>
        <button type="button" onClick={() => onLike(post.id)}>
          {liked ? `Unlike ${post.id}` : `Like ${post.id}`}
        </button>
      </div>
    );
  },
}));

function renderWithClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

function buildPosts(count) {
  const categories = ["Technology", "Design", "Web Dev", "AI"];

  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    title: `Story ${index + 1}`,
    excerpt: `Excerpt ${index + 1}`,
    content: `Content ${index + 1}`,
    author: "Tester",
    date: index < 3 ? new Date().toISOString().slice(0, 10) : "2026-05-01",
    category: categories[index % categories.length],
    likes: index,
  }));
}

describe("BlogListScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetToken.mockReturnValue("token");
    mockGetUserFromToken.mockReturnValue({
      email: "reader@example.com",
      name: "Reader",
    });
    mockGetLikedPostIds.mockReturnValue([]);
    mockLikePost.mockResolvedValue([]);
  });

  it("shows a loading state while posts are loading", () => {
    mockFetchPosts.mockReturnValue(new Promise(() => {}));

    renderWithClient(<BlogListScreen />);

    expect(screen.getByText("Loading stories...")).toBeInTheDocument();
  });

  it("shows an error message when posts fail to load", async () => {
    mockFetchPosts.mockRejectedValue(new Error("Could not load posts."));

    renderWithClient(<BlogListScreen />);

    expect(await screen.findByText("Could not load posts.")).toBeInTheDocument();
  });

  it("filters stories by search and paginates results", async () => {
    const posts = buildPosts(12);

    mockFetchPosts.mockImplementation((token, { page, limit }) => {
      const start = (page - 1) * limit;

      return Promise.resolve({
        posts: posts.slice(start, start + limit),
        total: posts.length,
        page,
      });
    });

    renderWithClient(<BlogListScreen />);

    expect(await screen.findByText("Story 1")).toBeInTheDocument();
    expect(screen.getByText("Story 10")).toBeInTheDocument();
    expect(screen.queryByText("Story 11")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByText("Story 11")).toBeInTheDocument();
    expect(screen.getByText("Story 12")).toBeInTheDocument();
    expect(screen.queryByText("Story 1")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search by title"), {
      target: { value: "Story 2" },
    });

    await waitFor(() => {
      expect(screen.getByText("Story 2")).toBeInTheDocument();
    });

    expect(screen.queryByText("Story 11")).not.toBeInTheDocument();
  });
});
