import { posts } from "@/data/posts";
import { PostCard } from "@/components/post/post-card";

export default function BlogPage() {
  const publishedPosts = posts.filter(
    (post) => post.status === "published" && post.type === "blog"
  );

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Blog</h1>
        <div className="grid gap-6 max-w-3xl">
          {publishedPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}
