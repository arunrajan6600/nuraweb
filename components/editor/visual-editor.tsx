"use client";

import { Cell, ImageContent, Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip, Trash2, Plus } from "lucide-react";
import { nanoid } from "nanoid";

interface VisualEditorProps {
  post: Post;
  onChange: (post: Post) => void;
}

interface CellEditorProps {
  cell: Cell;
  onChange: (cell: Cell) => void;
  onDelete: () => void;
}

function SortableCell({ cell, onChange, onDelete }: CellEditorProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: cell.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners}>
          <Grip className="h-5 w-5 text-muted-foreground cursor-move" />
        </div>
        <div className="flex-1">
          <CellEditor cell={cell} onChange={onChange} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

function CellEditor({ cell, onChange, onDelete }: CellEditorProps) {
  const handleContentChange = (value: string | ImageContent) => {
    onChange({ ...cell, content: value });
  };

  const handleTypeChange = (type: "markdown" | "image") => {
    if (type === cell.type) return;

    const newContent = type === "markdown" ? "" : { url: "", alt: "" };
    onChange({ ...cell, type, content: newContent });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Select
          value={cell.type}
          onValueChange={handleTypeChange as (value: string) => void}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="markdown">Markdown</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="ml-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {cell.type === "markdown" ? (
        <Textarea
          value={cell.content as string}
          onChange={(e) => handleContentChange(e.target.value)}
          className="min-h-[200px] font-mono"
        />
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={(cell.content as ImageContent).url}
              onChange={(e) =>
                handleContentChange({
                  ...(cell.content as ImageContent),
                  url: e.target.value,
                })
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={(cell.content as ImageContent).alt}
              onChange={(e) =>
                handleContentChange({
                  ...(cell.content as ImageContent),
                  alt: e.target.value,
                })
              }
              placeholder="Description of the image"
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export function VisualEditor({ post, onChange }: VisualEditorProps) {
  const [localPost, setLocalPost] = useState<Post>(post);

  useEffect(() => {
    onChange(localPost);
  }, [localPost, onChange]);

  const handleCellChange = useCallback((index: number, cell: Cell) => {
    setLocalPost((prev) => ({
      ...prev,
      cells: prev.cells.map((c, i) => (i === index ? cell : c)),
    }));
  }, []);

  const handleCellDelete = useCallback((index: number) => {
    setLocalPost((prev) => ({
      ...prev,
      cells: prev.cells.filter((_, i) => i !== index),
    }));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: {
      active: { id: string | number };
      over: { id: string | number } | null;
    }) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setLocalPost((prev) => {
          const oldIndex = prev.cells.findIndex(
            (cell) => cell.id === active.id
          );
          const newIndex = prev.cells.findIndex((cell) => cell.id === over.id);

          return {
            ...prev,
            cells: arrayMove(prev.cells, oldIndex, newIndex),
          };
        });
      }
    },
    []
  );

  const addCell = useCallback(() => {
    const newCell: Cell = {
      id: nanoid(),
      type: "markdown",
      content: "",
    };

    setLocalPost((prev) => ({
      ...prev,
      cells: [...prev.cells, newCell],
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={localPost.title}
            onChange={(e) =>
              setLocalPost((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={localPost.thumbnail?.url || ""}
                  onChange={(e) =>
                    setLocalPost((prev) => ({
                      ...prev,
                      thumbnail: {
                        ...(prev.thumbnail || { alt: "" }),
                        url: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  value={localPost.thumbnail?.alt || ""}
                  onChange={(e) =>
                    setLocalPost((prev) => ({
                      ...prev,
                      thumbnail: {
                        ...(prev.thumbnail || { url: "" }),
                        alt: e.target.value,
                      },
                    }))
                  }
                  placeholder="Description of the thumbnail"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <Label>Post Type</Label>
          <Select
            value={localPost.type}
            onValueChange={(value: "blog" | "project") =>
              setLocalPost((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Content Cells</Label>
          <Button onClick={addCell} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Cell
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localPost.cells.map((cell) => cell.id)}
            strategy={verticalListSortingStrategy}
          >
            {localPost.cells.map((cell, index) => (
              <SortableCell
                key={cell.id}
                cell={cell}
                onChange={(cell) => handleCellChange(index, cell)}
                onDelete={() => handleCellDelete(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
