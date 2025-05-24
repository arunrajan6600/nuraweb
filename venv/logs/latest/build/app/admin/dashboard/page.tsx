import Link from "next/link";
import { getAllPosts } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, PenSquare } from "lucide-react";
import PostTable from "@/components/admin/post-table";

export const metadata = {
  title: "Admin Dashboard | Surya Narayanan",
  description: "Manage your blog posts and projects",
};

export default async function AdminDashboardPage() {
  const posts = await getAllPosts();

  const blogPosts = posts.filter((post) => post.type === "blog" || !post.type);
  const projects = posts.filter((post) => post.type === "project");
  const drafts = posts.filter((post) => post.metadata.status === "draft");
  const published = posts.filter(
    (post) => post.metadata.status === "published"
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{posts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{blogPosts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{drafts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Posts</CardTitle>
                <CardDescription>
                  Manage all your blog posts and projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostTable posts={posts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Manage your blog posts.</CardDescription>
              </CardHeader>
              <CardContent>
                <PostTable posts={blogPosts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your projects.</CardDescription>
              </CardHeader>
              <CardContent>
                <PostTable posts={projects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="published" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Published Posts</CardTitle>
                <CardDescription>
                  Manage your published content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostTable posts={published} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Draft Posts</CardTitle>
                <CardDescription>Manage your draft content.</CardDescription>
              </CardHeader>
              <CardContent>
                <PostTable posts={drafts} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/new?type=blog">
                  <PenSquare className="mr-2 h-4 w-4" />
                  New Blog Post
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/new?type=project">
                  <PenSquare className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/posts">
                  <FileText className="mr-2 h-4 w-4" />
                  View Public Posts
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Published</span>
                    <span className="font-medium">{published.length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: posts.length
                          ? `${(published.length / posts.length) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Drafts</span>
                    <span className="font-medium">{drafts.length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: posts.length
                          ? `${(drafts.length / posts.length) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
