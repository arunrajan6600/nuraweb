import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPostBySlug } from "@/lib/db";
import CellRenderer from "@/components/shared/cell-renderer";
import PostActions from "@/components/post-actions";
import { formatDate } from "@/lib/utils";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found",
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Log post ID for debugging
  console.log("Displaying post with ID:", post.id);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {post.metadata?.date && (
            <time dateTime={new Date(post.metadata.date).toISOString()}>
              {formatDate(post.metadata.date)}
            </time>
          )}
          {post.metadata?.author && (
            <>
              <span>•</span>
              <span>{post.metadata.author}</span>
            </>
          )}
        </div>
      </div>

      {post.thumbnail && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.thumbnail || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <p className="text-lg text-muted-foreground">{post.description}</p>

      {/* Add post actions */}
      <PostActions post={post} />

      <div className="space-y-6">
        {post.cells?.map((cell) => (
          <CellRenderer key={cell.id} cell={cell} />
        ))}
      </div>
    </div>
  );
}
