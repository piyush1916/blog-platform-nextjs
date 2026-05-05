import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogDetailScreen from "../components/BlogDetailScreen";

const mockFetchPost = vi.fn();
const mockLikePost = vi.fn();
const mockGetToken = vi.fn();
const mockGetUserFromToken = vi.fn();
const mockGetLikedPostIds = vi.fn();
const mockToastSuccess = vi.fn();

vi.mock("next/link", () => ({
  default: function MockLink({ href, children, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: (...args) => mockToastSuccess(...args),
  },
}));

vi.mock("../lib/api", () => ({
  fetchPost: (...args) => mockFetchPost(...args),
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
  default: () => <div>Loading article...</div>,
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

const post = {
  id: "3",
  title: "Detail Story",
  excerpt: "Short summary",
  content: "Paragraph one.\n\nParagraph two.",
  author: "Ariana Fox",
  date: "2026-05-05",
  category: "Web Dev",
  likes: 8,
};

describe("BlogDetailScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetToken.mockReturnValue("token");
    mockGetUserFromToken.mockReturnValue({
      email: "reader@example.com",
      name: "Reader",
    });
    mockGetLikedPostIds.mockReturnValue([]);
    mockLikePost.mockResolvedValue(["3"]);
  });

  it("shows a loading state while the article is loading", () => {
    mockFetchPost.mockReturnValue(new Promise(() => {}));

    renderWithClient(<BlogDetailScreen postId="3" />);

    expect(screen.getByText("Loading article...")).toBeInTheDocument();
  });

  it("shows an error message when the article fails to load", async () => {
    mockFetchPost.mockRejectedValue(new Error("Post not found."));

    renderWithClient(<BlogDetailScreen postId="3" />);

    expect(await screen.findByText("Post not found.")).toBeInTheDocument();
  });

  it("renders article details and handles likes", async () => {
    mockFetchPost.mockResolvedValue(post);

    renderWithClient(<BlogDetailScreen postId="3" />);

    expect(await screen.findByText("Detail Story")).toBeInTheDocument();
    expect(screen.getByText("Short summary")).toBeInTheDocument();
    expect(screen.getByText("Paragraph one.")).toBeInTheDocument();
    expect(screen.getByText("Paragraph two.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Like this story" }));

    await waitFor(() => {
      expect(mockLikePost).toHaveBeenCalledWith("3", "reader@example.com");
    });

    expect(mockToastSuccess).toHaveBeenCalled();
  });
});
