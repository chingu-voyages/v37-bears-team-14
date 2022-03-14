import { FC, MouseEventHandler } from "react";
import PencilAltIcon from "../icons/PencilAltIcon";

interface EditLinkProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

const EditLink: FC<EditLinkProps> = ({ onClick, disabled = false }) => {
  return (
    <div
      onClick={onClick}
      className={
        " mx-2 inline cursor-pointer text-slate-600 hover:text-slate-900 active:text-slate-600 " +
        (!disabled ? "" : "opacity-40 hover:text-slate-600 cursor-not-allowed")
      }
    >
      <PencilAltIcon className="p-1 h-6 inline" />{" "}
      <span className="text-sm font-medium">Edit</span>
    </div>
  );
};

export default EditLink;
