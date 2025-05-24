import { v4 as uuidv4 } from "uuid";

export type CellType = "text" | "video" | "image" | "markdown" | "react";

export interface CellMetadata {
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Cell {
  id: string;
  type: CellType;
  content?: string;
  code?: string;
  metadata: CellMetadata;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  type?: "blog" | "project";
  cells: Cell[];
  metadata: {
    author: string;
    tags: string[];
    category: string;
    date: string;
    status: "draft" | "published";
  };
}

// Create a new empty cell (client-safe function)
export function createEmptyCell(
  type: CellType = "text",
  position: number
): Cell {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    type,
    content: "",
    code:
      type === "react"
        ? "function Component() {\n  return <div>Hello World</div>;\n}"
        : undefined,
    metadata: {
      position,
      created_at: now,
      updated_at: now,
    },
  };
}

// Create an empty post structure (client-safe function)
export function createEmptyPost(type: "blog" | "project" = "blog"): Post {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    slug: "",
    title: "",
    description: "",
    thumbnail: "",
    type,
    cells: [],
    metadata: {
      author: "",
      tags: [],
      category: "",
      date: now,
      status: "draft",
    },
  };
}
