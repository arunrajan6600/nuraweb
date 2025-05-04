import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { CellRenderer } from "@/components/blog/cell-renderer"
import type { BlogCell } from "@/types"

export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) {
    notFound()
  }

  // Parse the cells from JSON
  const cells = JSON.parse(post.cells as string) as BlogCell[]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article>
        <header className="mb-8 text-center">
          {post.imageUrl && (
            <img
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert mx-auto">
          {cells.map((cell) => (
            <CellRenderer key={cell.id} cell={cell} />
          ))}
        </div>
      </article>
    </div>
  )
}
