import { posts } from "@/data/posts";
import { EditPost } from "@/components/editor/edit-post";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

type Post = (typeof posts)[number];

function getPost(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

// Generate static params for all posts
export function generateStaticParams() {
  return posts.map((post) => ({
    id: post.id,
  }));
}

// Validate and transform params to ensure they're sanitized
function validateAndParseId(rawId: unknown) {
  return typeof rawId === "string" ? rawId : "";
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resolvedId = validateAndParseId(id);
  const post = getPost(resolvedId);

  if (!post) {
    return {
      title: "Edit Post - Not Found",
    };
  }

  return {
    title: `Edit - ${post.title}`,
  };
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const resolvedId = validateAndParseId(id);
  const post = getPost(resolvedId);

  if (!post) {
    notFound();
  }

  return <EditPost post={post} />;
}
