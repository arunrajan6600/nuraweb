import { posts } from "@/data/posts";
import { PostCard } from "@/components/post/post-card";

export default function ProjectsPage() {
  const publishedPosts = posts.filter(
    (post) => post.status === "published" && post.type === "project"
  );

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Projects</h1>
        <div className="grid gap-8">
          {publishedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
