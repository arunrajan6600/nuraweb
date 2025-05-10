import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectBase, ProjectWithParsedFields } from "@/types/project";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const projects = await db.project.findMany({
    where: {
      published: true,
      ...(searchParams.category && {
        category: searchParams.category,
      }),
    },
    orderBy: { createdAt: "desc" },
  });

  // Parse JSON fields for each project
  const parsedProjects: ProjectWithParsedFields[] = projects.map(
    (project: ProjectBase) => ({
      ...project,
      cells: JSON.parse(project.cells),
      technologies: JSON.parse(project.technologies),
    })
  );

  // Get unique categories
  const categories = [...new Set(parsedProjects.map((p) => p.category))];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <Link
            href="/projects"
            className={`px-3 py-1 rounded-full text-sm ${
              !searchParams.category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/projects?category=${category}`}
              className={`px-3 py-1 rounded-full text-sm ${
                searchParams.category === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parsedProjects.map((project) => (
          <Card key={project.id}>
            {project.imageUrl && (
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={project.imageUrl || "/placeholder.svg"}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader className="space-y-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold leading-none tracking-tight">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:underline"
                  >
                    {project.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
