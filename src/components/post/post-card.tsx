"use client";

import { Post } from "@/types/post";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ThumbnailCell } from "./thumbnail-cell";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact";
}

function getPreviewContent(post: Post) {
  const markdownCell = post.cells.find((cell) => cell.type === "markdown");
  if (!markdownCell) return "";

  const content = markdownCell.content as string;
  const words = content.split(" ");
  return words.slice(0, 50).join(" ") + (words.length > 50 ? "..." : "");
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const formattedDate = formatDistance(new Date(post.updatedAt), new Date(), {
    addSuffix: true,
  });
  const previewContent = getPreviewContent(post);
  const isCompact = variant === "compact";

  return (
    <Card className="w-full transition-colors hover:bg-muted/50">
      <Link href={`/post/${post.id}`} className="block">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <CardTitle className="transition-colors hover:text-primary">
              {post.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>

          {post.thumbnail && (
            <ThumbnailCell
              content={post.thumbnail}
              className={isCompact ? "h-48" : "h-64 md:h-72"}
            />
          )}

          {!isCompact && previewContent && (
            <p className="text-muted-foreground line-clamp-3">
              {previewContent}
            </p>
          )}

          <div className="flex items-center justify-end pt-2">
            <Button variant="ghost" size="sm" className="group">
              Read more{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
