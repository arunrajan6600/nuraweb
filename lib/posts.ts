import fs from "fs/promises";
import path from "path";
import type { Post } from "@/types";

const postsFilePath = path.join(process.cwd(), "posts.json");
const publishedPostsFilePath = path.join(
  process.cwd(),
  "lib",
  "published-posts.json"
);

export async function getPosts(): Promise<Post[]> {
  try {
    // In production, only return published posts from the static file
    if (process.env.NODE_ENV === "production") {
      const data = await fs.readFile(publishedPostsFilePath, "utf8");
      return JSON.parse(data);
    }

    // In development, use the editable posts file
    const data = await fs.readFile(postsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.id === id);
}

export async function savePosts(posts: Post[]): Promise<void> {
  // Only allow saving in development mode
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Saving posts is only allowed in development mode");
  }

  await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), "utf8");
}
