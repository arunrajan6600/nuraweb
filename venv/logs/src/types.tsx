export interface BlogCell {
  id: string;
  type: "text" | "image" | "quote" | "code" | "video";
  content: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  cells: any;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  cells: BlogCell[];
  imageUrl?: string | null;
  demoUrl?: string | null;
  sourceUrl?: string | null;
  technologies: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

import type { ProjectWithParsedFields } from "@/types/project";
export type ContentItem = BlogPost | ProjectWithParsedFields;
