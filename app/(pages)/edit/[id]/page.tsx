import { getAllPosts } from "@/lib/posts";
import { EditPost } from "@/components/editor/edit-post";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/types/post";

type SearchParams = Record<string, string | string[] | undefined>;

interface EditParams {
  id: string;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post: Post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: EditParams;
}): Promise<Metadata> {
  const posts = await getAllPosts();
  const post = posts.find((p: Post) => p.id === params.id);
  if (!post) return {};

  return {
    title: `Edit ${post.title}`,
    description: `Edit ${post.title}`,
  };
}

interface PageProps {
  params: EditParams;
  searchParams: SearchParams;
}

export default async function EditPostPage({
  params,
}: PageProps) {
  const posts = await getAllPosts();
  const post = posts.find((p: Post) => p.id === params.id);
  if (!post) notFound();

  return <EditPost post={post} />;
}
