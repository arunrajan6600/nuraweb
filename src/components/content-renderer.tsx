import type { BlogCell, ContentItem } from "@/types";
import { CellRenderer } from "./blog/cell-renderer";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";

interface ContentRendererProps {
  item: ContentItem;
  showHeader?: boolean;
}

export function ContentRenderer({
  item,
  showHeader = true,
}: ContentRendererProps) {
  const isProject = "technologies" in item;

  // Parse cells if they are stored as a string
  const cells =
    typeof item.cells === "string" ? JSON.parse(item.cells) : item.cells;

  return (
    <article>
      {showHeader && (
        <header className="mb-8">
          {item.imageUrl && (
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{item.title}</h1>

          {isProject && (
            <>
              <p className="text-xl text-muted-foreground mb-4">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4 mb-6">
                {item.demoUrl && (
                  <Button asChild>
                    <Link href={item.demoUrl} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Link>
                  </Button>
                )}
                {item.sourceUrl && (
                  <Button variant="outline" asChild>
                    <Link href={item.sourceUrl} target="_blank">
                      <Github className="mr-2 h-4 w-4" />
                      Source Code
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}

          <p className="text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>
      )}

      <div className="prose prose-lg dark:prose-invert mx-auto">
        {cells.map((cell: BlogCell) => (
          <CellRenderer key={cell.id} cell={cell} />
        ))}
      </div>
    </article>
  );
}
