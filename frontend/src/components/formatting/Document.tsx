import { FC } from "react";
import ReactMarkdown from "react-markdown";

interface DocumentProps {
  children: string;
}

/**
 * The tag definitions here customize the markdown for info pages,
 * standalone pages with static content.
 */
const Document: FC<DocumentProps> = ({ children }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children, ...props }) => (
          <h1
            className="first:mt-3 mt-6 mb-4 font-semibold text-4xl"
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="mt-4 mb-2 font-semibold text-xl" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="mt-2 font-semibold" {...props}>
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4 className="mt-2 font-semibold" {...props}>
            {children}
          </h4>
        ),
        h5: ({ children, ...props }) => (
          <h5 className="mt-2 font-semibold" {...props}>
            {children}
          </h5>
        ),
        h6: ({ children, ...props }) => (
          <h6 className="mt-2 font-semibold" {...props}>
            {children}
          </h6>
        ),
        code: ({ ...props }) => (
          <div className="overflow-x-scroll">
            <code
              {...props}
              className={
                (props.className || "") + " rounded bg-slate-100 text-sm p-1"
              }
            />
          </div>
        ),
        a: ({ children, ...props }) => (
          <a {...props} className="text-emerald-600 hover:underline">
            {children}
          </a>
        ),
        p: ({ children, ...props }) => (
          <p {...props} className="my-3">
            {children}
          </p>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Document;
