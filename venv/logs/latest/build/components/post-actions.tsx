"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit, Share } from "lucide-react"
import type { Post } from "@/lib/data"
import PostJsonDialog from "@/components/post-json-dialog"

interface PostActionsProps {
  post: Post
}

export default function PostActions({ post }: PostActionsProps) {
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <PostJsonDialog post={post} />

      {isClient && (
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link href={`/admin/edit/${post.slug}`}>
            <Edit className="h-4 w-4" />
            Edit Post
          </Link>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (navigator.share) {
            navigator
              .share({
                title: post.title,
                text: post.description,
                url: window.location.href,
              })
              .catch((err) => console.error("Error sharing:", err))
          } else {
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => alert("Link copied to clipboard!"))
              .catch((err) => console.error("Error copying:", err))
          }
        }}
        className="gap-2"
      >
        <Share className="h-4 w-4" />
        Share
      </Button>
    </div>
  )
}
