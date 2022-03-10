import { FC } from "react";
import ReactMarkdown from "react-markdown";

interface ReadmeProps {
  children: string;
}

const ProjectPageMarkdown: FC<ReadmeProps> = ({ children }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children, ...props }) => (
          <h1 className="mt-2 font-semibold text-2xl" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="mt-2 font-semibold text-xl" {...props}>
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
        ul: ({ children, ...props }) => (
          <ul className="list-disc" {...props}>
            {children}
          </ul>
        ),
        table: ({ children, ...props }) => (
          <table className="table-auto" {...props}>
            {children}
          </table>
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
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default ProjectPageMarkdown;
