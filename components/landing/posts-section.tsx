import type { Post } from "@/types"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PostsSectionProps {
  posts: Post[]
}

export function PostsSection({ posts }: PostsSectionProps) {
  return (
    <section className="py-20 px-4 bg-background" id="posts">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Posts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my thoughts, projects, and insights on technology, programming, and more.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function PostCard({ post }: { post: Post }) {
  // Get the first markdown cell for preview if available
  const previewCell = post.cells.find((cell) => cell.type === "markdown")
  const previewText =
    previewCell?.type === "markdown"
      ? previewCell.content.substring(0, 150).replace(/[#*`]/g, "") + "..."
      : "No preview available"

  // Get the first image cell for thumbnail if available
  const imageCell = post.cells.find((cell) => cell.type === "image")
  const thumbnailUrl = imageCell?.type === "image" ? imageCell.content.url : "/blog-post-concept.png"

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{formatDate(post.updatedAt)}</p>
      </CardHeader>
      <CardContent className="flex-grow-0">
        <p className="text-muted-foreground line-clamp-3">{previewText}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/posts/${post.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
