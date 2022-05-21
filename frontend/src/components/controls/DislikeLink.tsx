import { FC, MouseEventHandler } from "react";
import ThumbsDownIcon from "../icons/ThumbsDownIcon";
import ThumbsDownFilledIcon from "../icons/ThumbsDownFilledIcon";

interface DislikeLinkProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  filled: boolean;
  text: string;
  classes?: string;
}

const DislikeLink: FC<DislikeLinkProps> = ({
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
        <ThumbsDownFilledIcon className="p-1 pl-0 h-6 inline" />
      ) : (
        <ThumbsDownIcon className="p-1 pl-0 h-6 inline" />
      )}
      <span className="text-sm font-bold">{text}</span>{" "}
    </div>
  );
};

export default DislikeLink;
