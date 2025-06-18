import { posts } from "@/data/posts";
import { EditPost } from "@/components/editor/edit-post";
import { notFound } from "next/navigation";
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
      title: "Edit Post - Not Found",
    };
  }

  return {
    title: `Edit - ${post.title}`,
  };
}

export default function EditPostPage({ params }: Props) {
  const id = validateAndParseId(params.id);
  const post = getPost(id);

  if (!post) {
    notFound();
  }

  return <EditPost post={post} />;
}
