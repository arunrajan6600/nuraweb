import Link from "next/link";
import Image from "next/image";
import { getPostsByType } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog | Surya Narayanan",
  description:
    "Read my latest blog posts about web development, design, and more.",
};

export default async function BlogPage() {
  const posts = await getPostsByType("blog");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground text-lg">
            Thoughts, ideas, and tutorials on web development and design.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="border-b pb-8 last:border-0">
              <Link href={`/posts/${post.slug}`} className="group">
                <div className="grid md:grid-cols-[2fr_1fr] gap-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      {post.metadata?.date && (
                        <time
                          dateTime={new Date(post.metadata.date).toISOString()}
                        >
                          {formatDate(post.metadata.date)}
                        </time>
                      )}
                      {post.metadata?.tags?.length > 0 && (
                        <span className="ml-2">
                          • {post.metadata.tags.join(", ")}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{post.description}</p>
                  </div>

                  {post.thumbnail && (
                    <div className="relative aspect-video rounded-lg overflow-hidden order-first md:order-last">
                      <Image
                        src={post.thumbnail || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
