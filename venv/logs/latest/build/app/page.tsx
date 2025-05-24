import Link from "next/link";
import Image from "next/image";
import { getPostsByType } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import RayShaderBackground from "@/components/ray-shader-background";

export default async function HomePage() {
  const blogPosts = await getPostsByType("blog");
  const projects = await getPostsByType("project");

  return (
    <div className="relative">
      <RayShaderBackground />
      <div className="container mx-auto px-4 py-12 space-y-24 relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 py-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Hi, I&apos;m Surya Narayanan
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Developer, writer, and creator. I build things for the web and share
            what I learn.
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild size="lg">
              <Link href="/about">About Me</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">Read Blog</Link>
            </Button>
          </div>
        </section>

        {/* Blog Posts Preview */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Latest Blog Posts
            </h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/blog">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group"
              >
                <div className="space-y-3 border rounded-lg overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video relative">
                    <Image
                      src={
                        post.thumbnail ||
                        "/placeholder.svg?height=200&width=400&query=blog"
                      }
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {post.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {post.metadata?.date
                        ? formatDate(post.metadata.date)
                        : "No date"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Projects Preview */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Projects
            </h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/projects">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 2).map((project) => (
              <Link
                key={project.id}
                href={`/posts/${project.slug}`}
                className="group"
              >
                <div className="space-y-3 border rounded-lg overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video relative">
                    <Image
                      src={
                        project.thumbnail ||
                        "/placeholder.svg?height=200&width=400&query=project"
                      }
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.metadata?.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 border-t">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Get In Touch</h2>
            <p className="text-muted-foreground">
              Have a question or want to work together? Feel free to reach out.
            </p>
            <Button asChild size="lg">
              <Link href="/about#contact">Contact Me</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
