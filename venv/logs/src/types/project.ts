import { BlogCell } from "@/types";

export interface ProjectBase {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  cells: string; // Raw JSON string from DB
  imageUrl: string | null;
  demoUrl: string | null;
  sourceUrl: string | null;
  technologies: string; // Raw JSON string from DB
  category: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface ProjectWithParsedFields {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  cells: BlogCell[];
  imageUrl: string | null;
  demoUrl: string | null;
  sourceUrl: string | null;
  technologies: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}
