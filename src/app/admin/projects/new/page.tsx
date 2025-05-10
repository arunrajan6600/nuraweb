import { ProjectEditor } from "@/components/admin/project-editor";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <ProjectEditor project={{}} />
    </div>
  );
}
