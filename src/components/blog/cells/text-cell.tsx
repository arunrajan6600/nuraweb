import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import "katex/dist/katex.min.css";

interface TextCellContent {
  text: string;
}

interface TextCellProps {
  content: TextCellContent;
}

export function TextCell({ content }: TextCellProps) {
  return (
    <div className="my-6">
      <div className="prose dark:prose-invert max-w-none prose-headings:scroll-m-20 prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded-md prose-code:bg-muted prose-code:p-1 prose-pre:rounded-lg prose-pre:bg-muted prose-img:rounded-lg">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypePrism]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl mt-2 mb-4 font-bold tracking-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl mt-10 mb-4 font-semibold tracking-tight">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl mt-8 mb-4 font-semibold tracking-tight">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-xl mt-8 mb-4 font-semibold tracking-tight">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="leading-7 mb-4 [&:not(:first-child)]:mt-6">
                {children}
              </p>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="mt-6 border-l-2 border-primary pl-6 italic">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="my-4 border-muted" />,
            table: ({ children }) => (
              <div className="my-6 w-full overflow-y-auto">
                <table className="w-full">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border px-4 py-2 text-left font-bold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border px-4 py-2 text-left">{children}</td>
            ),
          }}
        >
          {content.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
