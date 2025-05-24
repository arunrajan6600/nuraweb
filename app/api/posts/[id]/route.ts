import { type NextRequest, NextResponse } from "next/server";
import { getPosts, savePosts } from "@/lib/posts";

// Check if admin mode is enabled
const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === "true";

export const dynamic = "force-dynamic";

// Handle both trailing and non-trailing slashes by normalizing params
function normalizeParams(params: { id: string }) {
  return {
    ...params,
    id: params.id.replace(/\/$/, ""), // Remove trailing slash from ID
  };
}

// Check if write operations are allowed
function isWriteAllowed() {
  return isAdminEnabled || process.env.NODE_ENV === "development";
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const normalizedParams = normalizeParams(params);
  const posts = await getPosts();
  const post = posts.find((p) => p.id === normalizedParams.id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isWriteAllowed()) {
    return NextResponse.json(
      { error: "Admin mode is not enabled" },
      { status: 403 }
    );
  }

  const normalizedParams = normalizeParams(params);
  const updatedPost = await request.json();
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === normalizedParams.id);

  if (index === -1) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Update the timestamp
  updatedPost.updatedAt = new Date().toISOString();

  // Preserve the creation date
  if (!updatedPost.createdAt && posts[index].createdAt) {
    updatedPost.createdAt = posts[index].createdAt;
  }

  posts[index] = { ...updatedPost, id: normalizedParams.id };
  await savePosts(posts);

  return NextResponse.json(posts[index]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isWriteAllowed()) {
      return NextResponse.json(
        { error: "Admin mode is not enabled" },
        { status: 403 }
      );
    }

    const normalizedParams = normalizeParams(params);

    // Validate post ID exists and is not empty after normalization
    if (!normalizedParams.id || normalizedParams.id.trim() === "") {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const posts = await getPosts();
    const postToDelete = posts.find((p) => p.id === normalizedParams.id);

    if (!postToDelete) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updatedPosts = posts.filter((p) => p.id !== normalizedParams.id);
    await savePosts(updatedPosts);

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully",
        id: normalizedParams.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
