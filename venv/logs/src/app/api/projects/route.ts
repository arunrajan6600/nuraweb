import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Schema for project validation
const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  published: z.boolean(),
  cells: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "image", "quote", "code", "video"]),
      content: z.any(),
    })
  ),
  imageUrl: z.string().optional().nullable(),
  demoUrl: z.string().optional().nullable(),
  sourceUrl: z.string().optional().nullable(),
  technologies: z.array(z.string()),
  category: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = projectSchema.parse(json);

    const project = await db.project.create({
      data: {
        ...body,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
