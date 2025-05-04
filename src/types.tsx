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
