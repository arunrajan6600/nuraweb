import ReactMarkdown from "react-markdown";

interface TextCellContent {
  text: string;
}

interface TextCellProps {
  content: TextCellContent;
}

export function TextCell({ content }: TextCellProps) {
  return (
    <div className="my-6">
      <div className="prose dark:prose-invert max-w-none prose-headings:scroll-m-20 prose-headings:font-bold">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-4xl mt-2 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-3xl mt-10 mb-4">{children}</h2>,
            h3: ({ children }) => <h3 className="text-2xl mt-8 mb-4">{children}</h3>,
            p: ({ children }) => <p className="leading-7 mb-4">{children}</p>,
          }}
        >
          {content.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
