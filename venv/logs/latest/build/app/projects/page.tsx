import Link from "next/link";
import Image from "next/image";
import { getPostsByType } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Projects | Surya Narayanan",
  description: "Check out my latest projects and work.",
};

export default async function ProjectsPage() {
  const projects = await getPostsByType("project");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-lg">
            A showcase of my work and side projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/posts/${project.slug}`}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                <div className="aspect-video relative">
                  <Image
                    src={
                      project.thumbnail ||
                      "/placeholder.svg?height=200&width=400&query=project"
                    }
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <h2 className="font-semibold text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-muted-foreground text-sm flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-3">
                    {project.metadata?.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {project.metadata?.date
                      ? formatDate(project.metadata.date)
                      : "No date"}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-12 col-span-2">
              <p className="text-muted-foreground">No projects found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
