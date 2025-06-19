import { Button } from "@/components/ui/button";
import Link from "next/link";
import { posts } from "@/data/posts";
import { PostCard } from "@/components/post/post-card";

export default function Home() {
  const featuredProjects = posts.filter(
    (post) =>
      post.status === "published" && post.featured && post.type === "project"
  );

  const featuredBlogPosts = posts.filter(
    (post) =>
      post.status === "published" && post.featured && post.type === "blog"
  );

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 py-12 md:py-16 text-center">
        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-none">
          <span className="text-primary">
            {"<"}arun nura{">"}
          </span>
        </h1>
        <p className="text-xl text-muted-foreground md:text-2xl font-light tracking-wide">
          multi-disciplinary art practitioner
        </p>
      </section>

      {/* Featured Projects */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Featured Projects
          </h2>
          <Button variant="ghost" asChild>
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-primary font-medium"
            >
              View all projects →
            </Link>
          </Button>
        </div>
        <div className="grid gap-6">
          {featuredProjects.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Featured Posts
          </h2>
          <Button variant="ghost" asChild>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-primary font-medium"
            >
              View all posts →
            </Link>
          </Button>
        </div>
        <div className="grid gap-6">
          {featuredBlogPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}
