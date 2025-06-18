"use client";

import Markdown from "markdown-to-jsx";

interface MarkdownCellProps {
  content: string;
}

export function MarkdownCell({ content }: MarkdownCellProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <Markdown>{content}</Markdown>
    </div>
  );
}
