"use server";

import { revalidatePath } from "next/cache";
import { type Post, type Cell, createEmptyCell } from "./data";
import { createPost, updatePost, deletePost, getPostById } from "./db";

// Create a new post
export async function createNewPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug =
    (formData.get("slug") as string) ||
    title.toLowerCase().replace(/\s+/g, "-");
  const description = formData.get("description") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const type = formData.get("type") as "blog" | "project";
  const author = formData.get("author") as string;
  const category = formData.get("category") as string;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const status = formData.get("status") as "draft" | "published";

  // Get cells from JSON string
  const cellsJson = formData.get("cells") as string;
  const cells = cellsJson ? (JSON.parse(cellsJson) as Cell[]) : [];

  const post: Omit<Post, "id"> = {
    slug,
    title,
    description,
    thumbnail,
    type,
    cells,
    metadata: {
      author,
      tags,
      category,
      date: new Date().toISOString(),
      status,
    },
  };

  const newPost = await createPost(post);

  revalidatePath("/admin/dashboard");
  revalidatePath(`/posts/${slug}`);

  return { success: true, id: newPost.id };
}

// Update an existing post
export async function updateExistingPost(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug =
    (formData.get("slug") as string) ||
    title.toLowerCase().replace(/\s+/g, "-");
  const description = formData.get("description") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const type = formData.get("type") as "blog" | "project";
  const author = formData.get("author") as string;
  const category = formData.get("category") as string;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const status = formData.get("status") as "draft" | "published";

  // Get cells from JSON string
  const cellsJson = formData.get("cells") as string;
  const cells = cellsJson ? (JSON.parse(cellsJson) as Cell[]) : [];

  const postData: Partial<Post> = {
    slug,
    title,
    description,
    thumbnail,
    type,
    cells,
    metadata: {
      author,
      tags,
      category,
      date: new Date().toISOString(),
      status,
    },
  };

  const updatedPost = await updatePost(id, postData);

  revalidatePath("/admin/dashboard");
  revalidatePath(`/posts/${slug}`);

  return { success: true, id: updatedPost.id };
}

// Delete a post
export async function deleteExistingPost(id: string) {
  await deletePost(id);
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// Add a new cell to a post
export async function addCellToPost(postId: string, type: Cell["type"]) {
  const post = await getPostById(postId);

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  const newCell = createEmptyCell(type, post.cells.length);
  post.cells.push(newCell);

  await updatePost(post);

  revalidatePath(`/admin/edit/${post.slug}`);

  return { success: true, cell: newCell };
}

// Update a cell in a post
export async function updateCellInPost(
  postId: string,
  cellId: string,
  updates: Partial<Cell>
) {
  const post = await getPostById(postId);

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  const cellIndex = post.cells.findIndex((cell) => cell.id === cellId);

  if (cellIndex === -1) {
    return { success: false, error: "Cell not found" };
  }

  post.cells[cellIndex] = {
    ...post.cells[cellIndex],
    ...updates,
    metadata: {
      ...post.cells[cellIndex].metadata,
      updated_at: new Date().toISOString(),
    },
  };

  await updatePost(post);

  revalidatePath(`/admin/edit/${post.slug}`);

  return { success: true };
}

// Remove a cell from a post
export async function removeCellFromPost(postId: string, cellId: string) {
  const post = await getPostById(postId);

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  post.cells = post.cells.filter((cell) => cell.id !== cellId);

  // Update positions
  post.cells = post.cells.map((cell, index) => ({
    ...cell,
    metadata: {
      ...cell.metadata,
      position: index,
      updated_at: new Date().toISOString(),
    },
  }));

  await updatePost(post);

  revalidatePath(`/admin/edit/${post.slug}`);

  return { success: true };
}

// Reorder cells in a post
export async function reorderCellsInPost(
  postId: string,
  cellId: string,
  newPosition: number
) {
  const post = await getPostById(postId);

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  const cellIndex = post.cells.findIndex((cell) => cell.id === cellId);

  if (cellIndex === -1) {
    return { success: false, error: "Cell not found" };
  }

  if (newPosition < 0 || newPosition >= post.cells.length) {
    return { success: false, error: "Invalid position" };
  }

  // Remove the cell from its current position
  const [cell] = post.cells.splice(cellIndex, 1);

  // Insert it at the new position
  post.cells.splice(newPosition, 0, cell);

  // Update positions
  post.cells = post.cells.map((cell, index) => ({
    ...cell,
    metadata: {
      ...cell.metadata,
      position: index,
      updated_at: new Date().toISOString(),
    },
  }));

  await updatePost(post);

  revalidatePath(`/admin/edit/${post.slug}`);

  return { success: true };
}

// Publish a post
export async function publishPost(id: string) {
  const post = await getPostById(id);

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  post.metadata.status = "published";

  await updatePost(post);

  revalidatePath("/admin/dashboard");
  revalidatePath(`/posts/${post.slug}`);

  return { success: true };
}

// Save a post as draft
export async function saveAsDraft(id: string) {
  const post = await getPostById(id);

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  post.metadata.status = "draft";

  await updatePost(post);

  revalidatePath("/admin/dashboard");

  return { success: true };
}
