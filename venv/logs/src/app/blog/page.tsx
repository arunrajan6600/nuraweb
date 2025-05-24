import Link from "next/link"
import { db } from "@/lib/db"

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

      <div className="grid grid-cols-1 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
            {post.imageUrl && (
              <div className="md:w-1/3">
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
              <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No blog posts yet.</p>
        </div>
      )}
    </div>
  )
}
