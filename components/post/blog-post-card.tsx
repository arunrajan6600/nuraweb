"use client";

import { Post } from "@/types/post";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = formatDistance(new Date(post.updatedAt), new Date(), {
    addSuffix: true,
  });

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold truncate">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formattedDate}
        </p>
      </div>

      <Link href={`/post/${post.id}`} className="ml-4">
        <Button variant="ghost" size="sm">
          Read more
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
