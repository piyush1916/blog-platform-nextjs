import BlogDetailScreen from "../../../../components/BlogDetailScreen";

export default async function BlogDetailPage({ params }) {
  const { id } = await params;

  return <BlogDetailScreen postId={id} />;
}
