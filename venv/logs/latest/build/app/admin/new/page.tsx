import { createEmptyPost } from "@/lib/data"
import PostForm from "@/components/admin/post-form"

export const metadata = {
  title: "New Post | Admin Dashboard",
  description: "Create a new blog post or project",
}

interface NewPostPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function NewPostPage({ searchParams }: NewPostPageProps) {
  // Get post type from query params
  const type = searchParams.type === "project" ? "project" : "blog"

  // Create an empty post with the specified type
  const emptyPost = createEmptyPost(type)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <PostForm initialPost={emptyPost} />
      </div>
    </div>
  )
}
