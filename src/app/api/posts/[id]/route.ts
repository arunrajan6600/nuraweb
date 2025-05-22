import { type NextRequest, NextResponse } from "next/server"
import { getPosts, savePosts } from "@/lib/posts"

// Only allow these routes in development
const isDevMode = process.env.NODE_ENV === "development"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const posts = await getPosts()
  const post = posts.find((p) => p.id === params.id)

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isDevMode) {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 })
  }

  const updatedPost = await request.json()
  const posts = await getPosts()
  const index = posts.findIndex((p) => p.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  // Update the timestamp
  updatedPost.updatedAt = new Date().toISOString()

  // Preserve the creation date
  if (!updatedPost.createdAt && posts[index].createdAt) {
    updatedPost.createdAt = posts[index].createdAt
  }

  posts[index] = { ...updatedPost, id: params.id }
  await savePosts(posts)

  return NextResponse.json(posts[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isDevMode) {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 })
  }

  const posts = await getPosts()
  const updatedPosts = posts.filter((p) => p.id !== params.id)

  if (posts.length === updatedPosts.length) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  await savePosts(updatedPosts)

  return NextResponse.json({ success: true })
}
