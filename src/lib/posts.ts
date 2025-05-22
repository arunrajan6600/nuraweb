import fs from "fs/promises"
import path from "path"
import type { Post } from "@/types"

const postsFilePath = path.join(process.cwd(), "posts.json")

export async function getPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(postsFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return []
  }
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getPosts()
  return posts.find((post) => post.id === id)
}

export async function savePosts(posts: Post[]): Promise<void> {
  // Only allow saving in development mode
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Saving posts is only allowed in development mode")
  }

  await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), "utf8")
}
