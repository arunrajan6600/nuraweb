import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { hashPassword, verifyPassword } from "@/lib/auth-utils"

// Schema for profile update
const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
})

export async function PUT(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Get the current user
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // If changing password, verify current password
    if (validatedData.newPassword) {
      if (!validatedData.currentPassword) {
        return NextResponse.json({ message: "Current password is required" }, { status: 400 })
      }

      const isPasswordValid = await verifyPassword(validatedData.currentPassword, user.password)

      if (!isPasswordValid) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
      }
    }

    // Update user data
    const updateData: any = {
      name: validatedData.name,
    }

    // If changing password, hash the new password
    if (validatedData.newPassword) {
      updateData.password = await hashPassword(validatedData.newPassword)
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
