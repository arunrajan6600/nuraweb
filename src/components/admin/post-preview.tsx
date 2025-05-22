import type { Post } from "@/types"
import { CellRenderer } from "@/components/cells/cell-renderer"

interface PostPreviewProps {
  post: Post
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="max-w-3xl mx-auto bg-background rounded-lg p-6">
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

      {post.cells.length === 0 && (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">This post has no content yet. Add cells to see them here.</p>
        </div>
      )}
    </div>
  )
}
