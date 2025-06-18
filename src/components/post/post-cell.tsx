import { Cell } from "@/types/post";
import { MarkdownCell } from "./markdown-cell";
import { ImageCell } from "./image-cell";
import { ThumbnailCell } from "./thumbnail-cell";

interface PostCellProps {
  cell: Cell;
  className?: string;
}

export function PostCell({ cell, className }: PostCellProps) {
  switch (cell.type) {
    case "markdown":
      return <MarkdownCell content={cell.content as string} />;
    case "image":
      return (
        <ImageCell content={cell.content as { url: string; alt: string }} />
      );
    case "thumbnail":
      return (
        <ThumbnailCell
          content={cell.content as { url: string; alt: string }}
          className={className}
        />
      );
    default:
      return null;
  }
}
