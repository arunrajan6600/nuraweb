import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/content-renderer";
import type { BlogPost } from "@prisma/client";

export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Parse cells before passing to ContentRenderer
  const parsedPost = {
    ...post,
    cells: typeof post.cells === "string" ? JSON.parse(post.cells) : post.cells,
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <ContentRenderer item={parsedPost} />
    </div>
  );
}
