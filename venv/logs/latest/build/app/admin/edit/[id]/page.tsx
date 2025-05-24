import { notFound } from "next/navigation";
import { getPostById } from "@/lib/db";
import PostForm from "@/components/admin/post-form";

export const metadata = {
  title: "Edit Post | Admin Dashboard",
  description: "Edit an existing blog post or project",
};

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  console.log("Attempting to edit post with ID or slug:", id);

  // The id parameter could be either an ID or a slug
  const post = await getPostById(id);

  if (!post) {
    console.error("Post not found with ID or slug:", id);
    notFound();
  }

  console.log("Post found:", post.title, "with ID:", post.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <PostForm initialPost={post} isEditing={true} />
      </div>
    </div>
  );
}
