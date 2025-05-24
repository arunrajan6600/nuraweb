import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { auth as authConfig } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const posts = await db.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/posts/new">Create New Post</Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="hover:underline font-medium"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      post.published
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/posts/${post.id}`}>Edit</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        View
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No blog posts yet. Create your first post!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
