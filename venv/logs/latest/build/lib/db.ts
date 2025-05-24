"use server";

import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import { Post } from "./data";
import { cache } from "react";

const DB_PATH = join(process.cwd(), "database.json");

// Helper function to read the database
async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty data
    const initialData = { posts: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

// Helper function to write to the database
async function writeDb(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Cache the database reads for better performance
export const getAllPosts = cache(async (): Promise<Post[]> => {
  const db = await readDb();
  return db.posts;
});

// Get posts by type and status
export const getPostsByType = cache(
  async (
    type?: "blog" | "project",
    status?: "draft" | "published"
  ): Promise<Post[]> => {
    const posts = await getAllPosts();

    return posts
      .filter((post) => {
        const typeMatch = type ? post.type === type : true;
        const statusMatch = status ? post.metadata?.status === status : true;
        return (
          typeMatch &&
          (status ? statusMatch : post.metadata?.status === "published")
        );
      })
      .sort((a, b) => {
        try {
          return (
            new Date(b.metadata.date).getTime() -
            new Date(a.metadata.date).getTime()
          );
        } catch (error) {
          return 0;
        }
      });
  }
);

// Create a new post
export async function createPost(postData: Omit<Post, "id">): Promise<Post> {
  const db = await readDb();
  const newPost = {
    ...postData,
    id: uuidv4(),
  };
  db.posts.push(newPost);
  await writeDb(db);
  return newPost;
}

// Update an existing post
export async function updatePost(
  id: string,
  postData: Partial<Post>
): Promise<Post> {
  const db = await readDb();
  const index = db.posts.findIndex((post: Post) => post.id === id);
  if (index === -1) throw new Error("Post not found");

  db.posts[index] = {
    ...db.posts[index],
    ...postData,
  };
  await writeDb(db);
  return db.posts[index];
}

// Delete a post
export async function deletePost(id: string): Promise<void> {
  const db = await readDb();
  db.posts = db.posts.filter((post: Post) => post.id !== id);
  await writeDb(db);
}

// Get a post by ID
export async function getPostById(id: string): Promise<Post | null> {
  const posts = await getAllPosts();
  let post = posts.find((p) => p.id === id);

  // If not found by ID, try to find by slug
  if (!post) {
    post = posts.find((p) => p.slug === id);
  }

  return post || null;
}

// Get a post by slug
export const getPostBySlug = cache(async (slug: string): Promise<Post> => {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error("Post not found");
  return post;
});
