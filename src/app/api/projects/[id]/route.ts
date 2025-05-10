import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { validateCells } from "@/lib/validate-cells";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z.string().min(1, "Description is required"),
  published: z.boolean().default(false),
  cells: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "image", "quote", "code", "video"]),
      content: z.any(),
    })
  ),
  imageUrl: z.string().optional(),
  demoUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  technologies: z.array(z.string()),
  category: z.string().min(1, "Category is required"),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const body = projectSchema.parse(json);

    const validationResult = validateCells(body.cells);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const project = await db.project.update({
      where: { id: params.id },
      data: {
        ...body,
        cells: JSON.stringify(body.cells),
        technologies: JSON.stringify(body.technologies), // Serialize technologies array
      },
    });

    // Parse technologies back to array for response
    return NextResponse.json({
      ...project,
      technologies: JSON.parse(project.technologies),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.project.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
