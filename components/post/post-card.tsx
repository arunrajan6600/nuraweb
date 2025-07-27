"use client";

import { Post } from "@/types/post";
import { BlogPostCard } from "./blog-post-card";
import { ProjectPostCard } from "./project-post-card";
import { PaperPostCard } from "./paper-post-card";
import { ArticlePostCard } from "./article-post-card";
import { NewsPostCard } from "./news-post-card";
import { LinkPostCard } from "./link-post-card";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact";
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  // Route to the appropriate component based on post type
  switch (post.type) {
    case "blog":
      return <BlogPostCard post={post} />;
    case "project":
      return <ProjectPostCard post={post} variant={variant} />;
    case "paper":
      return <PaperPostCard post={post} variant={variant} />;
    case "article":
      return <ArticlePostCard post={post} variant={variant} />;
    case "news":
      return <NewsPostCard post={post} variant={variant} />;
    case "link":
      return <LinkPostCard post={post} variant={variant} />;
    default:
      // Fallback for unknown post types
      return <ProjectPostCard post={post} variant={variant} />;
  }
}
