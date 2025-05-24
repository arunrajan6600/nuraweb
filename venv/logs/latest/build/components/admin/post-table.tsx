"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/data";
import { deleteExistingPost, publishPost, saveAsDraft } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import {
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  Send,
  Save,
  Code,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PostTableProps {
  posts: Post[];
}

export default function PostTable({ posts }: PostTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postForJson, setPostForJson] = useState<Post | null>(null);
  const [showJsonDialog, setShowJsonDialog] = useState(false);

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const result = await deleteExistingPost(postToDelete.id);

      if (result.success) {
        toast({
          title: "Post deleted",
          description: "The post has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the post. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPostToDelete(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const result = await publishPost(id);

      if (result.success) {
        toast({
          title: "Post published",
          description: "The post has been published successfully.",
        });
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to publish the post. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAsDraft = async (id: string) => {
    try {
      const result = await saveAsDraft(id);

      if (result.success) {
        toast({
          title: "Saved as draft",
          description: "The post has been saved as a draft.",
        });
      } else {
        toast({
          title: "Error",
          description:
            result.error ||
            "Failed to save the post as draft. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving post as draft:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No posts found. Create your first post to get started.
              </TableCell>
            </TableRow>
          )}

          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                {post.title || "Untitled Post"}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {post.type || "blog"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    post.metadata.status === "published"
                      ? "default"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {post.metadata.status}
                </Badge>
              </TableCell>
              <TableCell>
                {post.metadata?.date
                  ? new Date(post.metadata.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "No date"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        console.log(
                          "Navigating to edit page for post slug:",
                          post.slug
                        );
                        router.push(`/admin/edit/${post.slug}`);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/posts/${post.slug}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setPostForJson(post);
                        setShowJsonDialog(true);
                      }}
                    >
                      <Code className="mr-2 h-4 w-4" />
                      Copy as JSON
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {post.metadata.status === "draft" ? (
                      <DropdownMenuItem onClick={() => handlePublish(post.id)}>
                        <Send className="mr-2 h-4 w-4" />
                        Publish
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => handleSaveAsDraft(post.id)}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Unpublish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setPostToDelete(post)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!postToDelete}
        onOpenChange={(open) => !open && setPostToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post &quot;
              {postToDelete?.title || "Untitled Post"}&quot;. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {postForJson && (
        <Dialog open={showJsonDialog} onOpenChange={setShowJsonDialog}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Post JSON</DialogTitle>
              <DialogDescription>
                Copy this JSON and add it to your database.json file to include
                this post in your site.
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto max-h-[60vh] text-sm">
                <code>{JSON.stringify(postForJson, null, 2)}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(postForJson, null, 2)
                  );
                  toast({
                    title: "Copied to clipboard",
                    description: "The JSON has been copied to your clipboard.",
                  });
                }}
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
