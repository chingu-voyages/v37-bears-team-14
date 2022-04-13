import { FC, MouseEventHandler } from "react";
import CommentIcon from "../icons/CommentIcon";

interface CommentLinkProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  text: string;
  classes?: string;
}

const CommentLink: FC<CommentLinkProps> = ({
  onClick,
  disabled = false,
  text,
  classes,
}) => {
  return (
    <div
      onClick={onClick}
      className={
        " mr-1 inline cursor-pointer text-slate-600 hover:text-slate-900 active:text-slate-600 " +
        (!disabled
          ? ""
          : "opacity-40 hover:text-slate-600 cursor-not-allowed") +
        classes
      }
    >
      <CommentIcon className="p-1 pl-0 h-6 inline" />{" "}
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export default CommentLink;
