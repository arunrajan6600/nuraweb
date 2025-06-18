"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Post } from "@/types/post";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { VisualEditor } from "@/components/editor/visual-editor";

interface EditPostProps {
  post: Post;
}

export function EditPost({ post }: EditPostProps) {
  const [editedPost, setEditedPost] = useState<Post>(post);

  const handleCopyJson = () => {
    const json = JSON.stringify(editedPost, null, 2);
    navigator.clipboard.writeText(json);
  };

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Post: {post.title}</h1>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">View JSON</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-4xl">
              <DrawerHeader>
                <DrawerTitle>Post JSON</DrawerTitle>
              </DrawerHeader>
              <div className="p-6">
                <Card className="relative">
                  <pre className="p-4 text-sm overflow-auto max-h-[600px]">
                    <code>{JSON.stringify(editedPost, null, 2)}</code>
                  </pre>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleCopyJson}
                  >
                    Copy
                  </Button>
                </Card>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <VisualEditor post={editedPost} onChange={setEditedPost} />
    </div>
  );
}
