import { PostView } from "@/components/post-view";
import { getPostById, getPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const posts = await getPosts();
  // Only generate pages for published posts in production
  const filteredPosts =
    process.env.NODE_ENV === "production"
      ? posts.filter((post) => post.status === "published")
      : posts;

  return filteredPosts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostPage({ params }: PageProps) {
  // Validate params at the start
  if (!params?.id) {
    notFound();
  }

  // Type assertion since we know it's a string from generateStaticParams
  const postId = params.id as string;

  const post = await getPostById(params.id);
  const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === "true";

  // In production, only show published posts
  if (
    !post ||
    (process.env.NODE_ENV === "production" &&
      post.status !== "published" &&
      !isAdminEnabled)
  ) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Button>
        </Link>
      </div>
      <PostView post={post} />
    </div>
  );
}
