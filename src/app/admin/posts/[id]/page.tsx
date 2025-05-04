import { notFound, redirect } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin")
  }

  const post = await db.blogPost.findUnique({
    where: { id: params.id },
  })

  if (!post) {
    notFound()
  }

  // Parse the cells from JSON
  const parsedPost = {
    ...post,
    cells: JSON.parse(post.cells as string),
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostEditor post={parsedPost} />
    </div>
  )
}
