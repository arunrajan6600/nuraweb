import { PostList } from "@/components/post-list";
import { getPublishedPosts } from "@/lib/posts";

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="container py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">All Works</h1>
        <PostList posts={posts} />
      </div>
    </div>
  );
}
