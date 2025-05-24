import { type NextRequest, NextResponse } from "next/server";
import { getPosts, savePosts } from "@/lib/posts";
import type { Post } from "@/types";

// Check if admin mode is enabled
const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === "true";

// Use force-dynamic for API routes
export const dynamic = "force-dynamic";

// Check if write operations are allowed
function isWriteAllowed() {
  return isAdminEnabled || process.env.NODE_ENV === "development";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const posts = await getPosts();

  let filteredPosts = posts;

  // Filter by status if provided
  if (status) {
    filteredPosts = filteredPosts.filter((post) => post.status === status);
  }

  // Filter by search term if provided
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(searchLower)
    );
  }

  return NextResponse.json(filteredPosts);
}

export async function POST(request: NextRequest) {
  if (!isWriteAllowed()) {
    return NextResponse.json(
      { error: "Not allowed in production" },
      { status: 403 }
    );
  }

  const newPost = (await request.json()) as Partial<Post>;
  const posts = await getPosts();

  // Generate a unique ID if not provided
  if (!newPost.id) {
    newPost.id = Date.now().toString();
  }

  // Ensure cells array exists
  if (!newPost.cells) {
    newPost.cells = [];
  }

  // Set default status to draft
  if (!newPost.status) {
    newPost.status = "draft";
  }

  // Set timestamps
  const now = new Date().toISOString();
  newPost.createdAt = now;
  newPost.updatedAt = now;

  const completePost = newPost as Post;
  const updatedPosts = [...posts, completePost];
  await savePosts(updatedPosts);

  return NextResponse.json(completePost);
}
