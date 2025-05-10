import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/content-renderer";
import type { ProjectBase, ProjectWithParsedFields } from "@/types/project";

export async function generateStaticParams() {
  const projects = await db.project.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return projects.map((project: ProjectBase) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = (await db.project.findUnique({
    where: { slug: params.slug },
  })) as ProjectBase | null;

  if (!project || !project.published) {
    notFound();
  }

  // Parse JSON fields
  const parsedProject: ProjectWithParsedFields = {
    ...project,
    cells: JSON.parse(project.cells),
    technologies: JSON.parse(project.technologies),
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <ContentRenderer item={parsedProject} />
    </div>
  );
}
