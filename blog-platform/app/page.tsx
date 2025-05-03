import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"

export default async function Home() {
  const featuredPosts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ModularBlog</h1>
        <p className="text-xl text-muted-foreground mb-8">A modern blogging platform with a modular content system</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/blog">Read Blog</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <div key={post.id} className="border rounded-lg overflow-hidden">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
