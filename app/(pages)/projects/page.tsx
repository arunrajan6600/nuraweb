import { getPostsByType } from "@/lib/posts";
import { PostCard } from "@/components/post/post-card";

export default async function ProjectsPage() {
  const publishedPosts = await getPostsByType("project");

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-12 md:mb-16">
          Projects
        </h1>
        <div className="grid gap-8 md:gap-10">
          {publishedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
