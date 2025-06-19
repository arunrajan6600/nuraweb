export interface Post {
  title: string;
  cells: Cell[];
  thumbnail?: ImageContent;
  status: "published" | "draft";
  featured: boolean;
  type: "project" | "blog"; // New field to distinguish between projects and blog posts
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cell {
  id: string;
  type: "markdown" | "image" | "video";
  content: string | ImageContent | VideoContent;
}

export interface ImageContent {
  url: string;
  alt: string;
}

export interface VideoContent {
  url: string;
  title: string;
  provider?: "youtube" | "vimeo" | "direct";
}
