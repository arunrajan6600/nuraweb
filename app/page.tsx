import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getFeaturedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post/post-card";
import MatrixGridBackground from "@/components/ui/matrix-grid-background";

export default async function Home() {
  const allFeatured = await getFeaturedPosts();
  const featuredProjects = allFeatured.filter((post) => post.type === "project");
  const featuredBlogPosts = allFeatured.filter((post) => post.type === "blog");

  return (
    <>
      {/* Full-screen Matrix Grid Background - only visible in dark mode */}
      <MatrixGridBackground className="dark:block hidden" />

      {/* Content */}
      <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center gap-8 py-16 md:py-20 lg:py-24 text-center">
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
          <div className="flex items-center justify-between mb-12 md:mb-16">
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
          <div className="grid gap-8 md:gap-10">
            {featuredProjects.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-12 md:mb-16">
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
          <div className="grid gap-8 md:gap-10">
            {featuredBlogPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
