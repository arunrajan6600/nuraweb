import { redirect } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { auth } from "@/lib/auth"

export default async function NewPostPage() {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin")
  }

  // Create a new empty post
  const emptyPost = {
    id: "",
    title: "",
    slug: "",
    published: false,
    cells: [],
    imageUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <PostEditor post={emptyPost} />
    </div>
  )
}
