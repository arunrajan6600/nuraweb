import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: {
        orderBy: { updatedAt: "desc" },
      },
    },
  })

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {user.role === "admin" && (
          <Button asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Role:</span>
                <span className="capitalize">{user.role}</span>
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/profile">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Posts</CardTitle>
            <CardDescription>Manage your blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Total Posts: {user.posts.length}</p>
              <p>Published: {user.posts.filter((post) => post.published).length}</p>
              <p>Drafts: {user.posts.filter((post) => !post.published).length}</p>
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/posts">View All Posts</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/admin/posts/new">Create New Post</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/blog">View Blog</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
      {user.posts.length > 0 ? (
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
              {user.posts.slice(0, 5).map((post) => (
                <tr key={post.id} className="border-t">
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${post.id}`} className="hover:underline font-medium">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        post.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(post.updatedAt).toLocaleDateString()}</td>
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
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">You haven't created any posts yet.</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/posts/new">Create Your First Post</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
