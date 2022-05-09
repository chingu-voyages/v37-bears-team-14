import { FC, MouseEventHandler } from "react";
import ThumbsUpIcon from "../icons/ThumbsUpIcon";
import ThumbsUpFilledIcon from "../icons/ThumbsUpFilledIcon";

interface LikeLinkProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  filled: boolean;
  text: string;
  disabled?: boolean;
  classes?: string;
}

const LikeLink: FC<LikeLinkProps> = ({
  onClick,
  disabled = false,
  filled,
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
      {filled ? (
        <ThumbsUpFilledIcon className="p-1 pl-0 h-6 inline" />
      ) : (
        <ThumbsUpIcon className="p-1 pl-0 h-6 inline" />
      )}
      <span className="text-sm font-bold">{text}</span>{" "}
    </div>
  );
};

export default LikeLink;
