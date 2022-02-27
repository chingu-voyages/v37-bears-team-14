import { FC } from "react";

interface DetailsProps {
  children: any;
  title?: any;
  open?: boolean;
}

const Details: FC<DetailsProps> = ({ children, title, open }) => {
  return (
    <>
      <details open={open}>
        <summary className="cursor-pointer">{title || "More Info"}</summary>
        <div className="ml-1 border-l-2 border-slate-400 pl-3 pr-2 py-1">
          {children}
        </div>
      </details>
    </>
  );
};

export default Details;
