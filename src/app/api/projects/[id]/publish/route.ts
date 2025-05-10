import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await db.project.update({
      where: { id: params.id },
      data: { published: true },
    });

    return NextResponse.json(project);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
