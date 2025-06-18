import { notFound } from "next/navigation";
import { posts } from "@/data/posts";
import { PostCell } from "@/components/post/post-cell";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface Props {
  params: { id: string };
}

type Post = (typeof posts)[number];

function getPost(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

// Validate and transform params to ensure they're sanitized
function validateAndParseId(rawId: unknown) {
  return typeof rawId === "string" ? rawId : "";
}

// Generate metadata for the page
export function generateMetadata({ params }: Props): Metadata {
  const id = validateAndParseId(params.id);
  const post = getPost(id);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
  };
}

// Generate static paths at build time
export function generateStaticParams() {
  return posts
    .filter((post) => post.status === "published")
    .map((post) => ({
      id: post.id,
    }));
}

export default function PostPage({ params }: Props) {
  // Validate and parse id
  const id = validateAndParseId(params.id);
  const post = getPost(id);

  if (!post || post.status !== "published") {
    notFound();
  }

  const formattedDate = formatDistance(new Date(post.updatedAt), new Date(), {
    addSuffix: true,
  });

  return (
    <article className="max-w-4xl mx-auto py-8">
      <Button variant="ghost" className="mb-8" asChild>
        <Link href={post.type === "project" ? "/projects" : "/blog"}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {post.type === "project" ? "Projects" : "Blog"}
        </Link>
      </Button>

      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-sm text-muted-foreground">Updated {formattedDate}</p>
      </div>

      <div className="space-y-8">
        {post.cells.map((cell) => (
          <PostCell key={cell.id} cell={cell} />
        ))}
      </div>
    </article>
  );
}
