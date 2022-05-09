import { FC, MouseEventHandler } from "react";
import ThumbsDownIcon from "../icons/ThumbsDownIcon";

interface LikeLinkProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  classes?: string;
}

const DislikeLink: FC<LikeLinkProps> = ({
  onClick,
  disabled = false,

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
      <ThumbsDownIcon className="p-1 pl-0 h-6 inline" />{" "}
    </div>
  );
};

export default DislikeLink;
