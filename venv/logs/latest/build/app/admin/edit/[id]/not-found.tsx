import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Post Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        The post you are trying to edit doesn't exist or has been deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/admin/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
}
