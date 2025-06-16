"use client";

import type React from "react";

import { useState } from "react";
import type { Post, PostStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Save, Eye, EyeOff, ExternalLink } from "lucide-react";
import { CellList } from "@/components/admin/cell-list";
import { AddCellDialog } from "@/components/admin/add-cell-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostPreview } from "@/components/admin/post-preview";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface PostEditorProps {
  post: Post;
  onUpdate: (post: Post) => void;
  onDelete: () => void;
}

export function PostEditor({ post, onUpdate, onDelete }: PostEditorProps) {
  const [title, setTitle] = useState(post.title);
  const [cells, setCells] = useState(post.cells);
  const [status, setStatus] = useState<PostStatus>(post.status || "draft");
  const [featured, setFeatured] = useState(post.featured || false);
  const [isAddCellOpen, setIsAddCellOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedPost = {
        ...post,
        title,
        cells,
        status,
        featured,
        updatedAt: new Date().toISOString(),
      };
      await onUpdate(updatedPost);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setStatus("published");
    await onUpdate({
      ...post,
      title,
      cells,
      status: "published",
      featured,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUnpublish = async () => {
    setStatus("draft");
    await onUpdate({
      ...post,
      title,
      cells,
      status: "draft",
      featured,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCellsChange = (updatedCells: Post["cells"]) => {
    setCells(updatedCells);
  };

  const isDraft = status === "draft";
  const hasUnsavedChanges =
    title !== post.title ||
    JSON.stringify(cells) !== JSON.stringify(post.cells) ||
    status !== post.status ||
    featured !== post.featured;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full max-w-lg"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <Button
              variant={status === "published" ? "default" : "outline"}
              onClick={() =>
                setStatus(status === "published" ? "draft" : "published")
              }
            >
              {status === "published" ? (
                <Eye className="mr-2 h-4 w-4" />
              ) : (
                <EyeOff className="mr-2 h-4 w-4" />
              )}
              {status === "published" ? "Published" : "Draft"}
            </Button>
          </div>
        </div>
        {post.updatedAt && (
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {formatDate(post.updatedAt)}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        {post.status === "published" && (
          <Link href={`/posts/${post.id}`} passHref>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Post
            </Button>
          </Link>
        )}

        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isSaving || !hasUnsavedChanges}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>

        {isDraft ? (
          <Button onClick={handlePublish}>
            <Eye className="mr-2 h-4 w-4" />
            Publish
          </Button>
        ) : (
          <Button variant="outline" onClick={handleUnpublish}>
            <EyeOff className="mr-2 h-4 w-4" />
            Unpublish
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Cells</h3>
            <Button onClick={() => setIsAddCellOpen(true)}>Add Cell</Button>
          </div>

          <CellList cells={cells} onChange={handleCellsChange} />

          <AddCellDialog
            open={isAddCellOpen}
            onOpenChange={setIsAddCellOpen}
            onAddCell={(cell) => {
              const updatedCells = [...cells, cell];
              handleCellsChange(updatedCells);
            }}
          />
        </TabsContent>

        <TabsContent value="preview">
          <PostPreview post={{ ...post, title, cells, status }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
