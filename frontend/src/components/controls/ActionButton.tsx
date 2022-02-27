import { EventHandler, FunctionComponent, MouseEvent } from "react";

export interface ActionButtonProps {
  onClick?: EventHandler<MouseEvent>;
  children?: any;
  className?: string;
  disabled?: boolean;
  additionalClassName?: string;
}

const ActionButton: FunctionComponent<ActionButtonProps> = (props) => {
  const { onClick, children, className, disabled, additionalClassName } = props;
  const defaultClassname =
    "rounded border-[1px] border-emerald-800 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-600 text-white text-center font-semibold text-xs px-3 py-1 cursor-pointer";
  const disabledClasses = disabled
    ? " opacity-50 cursor-not-allowed hover:bg-emerald-600 "
    : " ";
  return (
    <div
      className={
        (className || defaultClassname) +
        disabledClasses +
        (additionalClassName || "")
      }
      onClick={(e) => !disabled && onClick && onClick(e)}
    >
      {children}
    </div>
  );
};

export default ActionButton;
