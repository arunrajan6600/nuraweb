"use client"

import Link from "next/link"
import type { Post } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Edit, ExternalLink } from "lucide-react"

interface PostListProps {
  posts: Post[]
  showStatus?: boolean
  onEditPost?: (postId: string) => void
}

export function PostList({ posts, showStatus = false, onEditPost }: PostListProps) {
  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground">No posts found.</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id} className="h-full hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="mr-2">{post.title}</CardTitle>
              {showStatus && <Badge variant={post.status === "published" ? "default" : "outline"}>{post.status}</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {post.cells.length} cell{post.cells.length !== 1 ? "s" : ""}
            </p>
            {post.updatedAt && (
              <p className="text-sm text-muted-foreground mt-2">Updated: {formatDate(post.updatedAt)}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {onEditPost && (
              <Button variant="ghost" size="sm" onClick={() => onEditPost(post.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Link href={`/posts/${post.id}`} passHref>
              <Button variant="ghost" size="sm">
                View
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
