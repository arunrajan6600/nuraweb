import fs from 'fs';
import path from 'path';
import { Post } from '@/types/post';

const POSTS_DIRECTORY = path.join(process.cwd(), 'data', 'posts');

function readFileSync(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export async function getAllPosts(): Promise<Post[]> {
  // Use sync operations for static site generation
  const files = fs.readdirSync(POSTS_DIRECTORY);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  const posts = jsonFiles.map((filename) => {
    const filePath = path.join(POSTS_DIRECTORY, filename);
    const content = readFileSync(filePath);
    return JSON.parse(content) as Post;
  });

  // Sort posts by createdAt date in descending order
  return posts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const filePath = path.join(POSTS_DIRECTORY, `${id}.json`);
    const content = readFileSync(filePath);
    return JSON.parse(content) as Post;
  } catch (error) {
    return null;
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.featured);
}

export async function getPostsByType(type: 'blog' | 'project'): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.type === type);
}
