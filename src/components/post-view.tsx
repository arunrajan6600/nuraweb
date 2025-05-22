import type { Post } from "@/types"
import { CellRenderer } from "@/components/cells/cell-renderer"

interface PostViewProps {
  post: Post
}

export function PostView({ post }: PostViewProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        {post.updatedAt && (
          <p className="text-sm text-muted-foreground">{new Date(post.updatedAt).toLocaleDateString()}</p>
        )}
      </div>

      <div className="space-y-12">
        {post.cells.map((cell) => (
          <CellRenderer key={cell.id} cell={cell} />
        ))}
      </div>
    </div>
  )
}
