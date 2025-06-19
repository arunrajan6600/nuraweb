"use client";

import Markdown from "markdown-to-jsx";

interface MarkdownCellProps {
  content: string;
}

export function MarkdownCell({ content }: MarkdownCellProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-code:font-mono prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:font-mono prose-pre:bg-muted prose-pre:border">
      <Markdown>{content}</Markdown>
    </div>
  );
}
