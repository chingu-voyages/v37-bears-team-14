import { FC, MouseEventHandler } from "react";
import TrashIcon from "../icons/TrashIcon";

interface DeleteLinkProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  classes?: string;
}

const DeleteLink: FC<DeleteLinkProps> = ({
  onClick,
  disabled = false,
  classes,
}) => {
  return (
    <div
      onClick={onClick}
      className={
        " mx-2 inline cursor-pointer text-slate-600 hover:text-slate-900 active:text-slate-600 " +
        (!disabled
          ? ""
          : "opacity-40 hover:text-slate-600 cursor-not-allowed") +
        classes
      }
    >
      <TrashIcon className="p-1 h-6 inline" />{" "}
      <span className="text-sm font-medium">Delete</span>
    </div>
  );
};

export default DeleteLink;
