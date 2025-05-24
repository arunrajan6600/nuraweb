import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  // Check if user has admin role
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const [posts, projects] = await Promise.all([
    db.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    db.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Posts Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Blog Posts</h2>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href="/admin/posts">View All</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/posts/new">New Post</Link>
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Author</th>
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
                    {post.authorId ? "User" : "Admin"}
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
                    colSpan={5}
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

      {/* Projects Section */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Projects</h2>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href="/admin/projects">View All</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/projects/new">New Project</Link>
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Last Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="hover:underline font-medium"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {project.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        project.published
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                        >
                          View
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No projects yet. Create your first project!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
