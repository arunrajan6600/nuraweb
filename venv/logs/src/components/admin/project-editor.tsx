"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { CellEditor } from "./cell-editor";
import type { Project, BlogCell } from "@/types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProjectEditorProps {
  project: Partial<Project>;
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [formData, setFormData] = useState({
    title: project.title || "",
    slug: project.slug || "",
    description: project.description || "",
    published: project.published || false,
    imageUrl: project.imageUrl || "",
    demoUrl: project.demoUrl || "",
    sourceUrl: project.sourceUrl || "",
    technologies: project.technologies || [],
    category: project.category || "",
  });
  const [cells, setCells] = useState<BlogCell[]>(project.cells || []);
  const [techInput, setTechInput] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  const handleGenerateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleAddTechnology = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...prev.technologies, techInput.trim()],
        }));
      }
      setTechInput("");
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleAddCell = (type: BlogCell["type"]) => {
    const newCell: BlogCell = {
      id: uuidv4(),
      type,
      content: getDefaultCellContent(type),
    };
    setCells((prev) => [...prev, newCell]);
  };

  const handleUpdateCell = (id: string, content: any) => {
    setCells((prev) =>
      prev.map((cell) => (cell.id === id ? { ...cell, content } : cell))
    );
  };

  const handleRemoveCell = (id: string) => {
    setCells((prev) => prev.filter((cell) => cell.id !== id));
  };

  const handleSaveProject = async () => {
    try {
      setIsLoading(true);
      const payload = {
        ...formData,
        cells,
      };

      const url = project.id ? `/api/projects/${project.id}` : "/api/projects";
      const method = project.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      toast({
        title: "Success",
        description: "Project saved successfully",
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Project title"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateSlug}
              >
                Generate from Title
              </Button>
            </div>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="project-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Project description"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Web Development, Mobile App, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleRemoveTechnology(tech)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Input
              id="technologies"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTechnology}
              placeholder="Type a technology and press Enter"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Cover Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleInputChange}
              placeholder="https://demo.example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl">Source Code URL</Label>
            <Input
              id="sourceUrl"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="published">Published</Label>
          </div>

          {formData.imageUrl && (
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Cover Image Preview</p>
              <img
                src={formData.imageUrl}
                alt="Project cover"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor">Content Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddCell("text")}
            >
              Add Text
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddCell("image")}
            >
              Add Image
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddCell("quote")}
            >
              Add Quote
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddCell("code")}
            >
              Add Code
            </Button>
          </div>

          <div className="space-y-4">
            {cells.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">
                  No content cells yet. Add your first cell above.
                </p>
              </div>
            )}

            {cells.map((cell) => (
              <div key={cell.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium capitalize">
                    {cell.type} Cell
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCell(cell.id)}
                  >
                    Remove
                  </Button>
                </div>
                <CellEditor
                  cell={cell}
                  onUpdate={(content) => handleUpdateCell(cell.id, content)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4">
              {formData.title || "Untitled Project"}
            </h1>

            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {formData.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            <p className="text-lg mb-6">{formData.description}</p>

            {(formData.demoUrl || formData.sourceUrl) && (
              <div className="flex gap-4 mb-6">
                {formData.demoUrl && (
                  <Button asChild>
                    <a
                      href={formData.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Demo
                    </a>
                  </Button>
                )}
                {formData.sourceUrl && (
                  <Button variant="outline" asChild>
                    <a
                      href={formData.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-6">
              {cells.map((cell) => {
                switch (cell.type) {
                  case "text":
                    return (
                      <div key={cell.id} className="prose dark:prose-invert">
                        {cell.content.text}
                      </div>
                    );
                  case "image":
                    return (
                      <figure key={cell.id}>
                        <img
                          src={cell.content.url}
                          alt={cell.content.alt || ""}
                          className="rounded-lg"
                        />
                        {cell.content.caption && (
                          <figcaption className="text-center mt-2">
                            {cell.content.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  case "quote":
                    return (
                      <blockquote
                        key={cell.id}
                        className="border-l-4 border-primary pl-4 italic"
                      >
                        <p>{cell.content.text}</p>
                        {cell.content.author && (
                          <footer>— {cell.content.author}</footer>
                        )}
                      </blockquote>
                    );
                  case "code":
                    return (
                      <pre
                        key={cell.id}
                        className="bg-muted p-4 rounded-lg overflow-x-auto"
                      >
                        <code>{cell.content.code}</code>
                      </pre>
                    );
                  default:
                    return <div key={cell.id}>Unknown cell type</div>;
                }
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between gap-4">
        <div className="space-x-2">
          {project.id && (
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const response = await fetch(`/api/projects/${project.id}`, {
                    method: "DELETE",
                  });
                  if (!response.ok) throw new Error("Failed to delete project");
                  toast({
                    title: "Success",
                    description: "Project deleted successfully",
                  });
                  router.push("/admin");
                  router.refresh();
                } catch (error) {
                  toast({
                    title: "Error",
                    description:
                      error instanceof Error
                        ? error.message
                        : "Failed to delete project",
                    variant: "destructive",
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
        </div>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveProject}
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : project.id
              ? "Update Project"
              : "Create Project"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function getDefaultCellContent(type: BlogCell["type"]) {
  switch (type) {
    case "text":
      return { text: "" };
    case "image":
      return { url: "", caption: "", alt: "" };
    case "quote":
      return { text: "", author: "" };
    case "code":
      return { code: "", language: "javascript" };
    default:
      return {};
  }
}
