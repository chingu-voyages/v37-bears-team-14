import { FunctionComponent, useRef, useState } from "react";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import useOutsideClickHandler from "../../hooks/useOutsideClickHandler";

interface RoleSelectorProps {
  value: string;
  options: string[];
  onChange?: (value: string) => Promise<void>;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
}

const RoleSelector: FunctionComponent<RoleSelectorProps> = ({
  value,
  options,
  onChange,
  backgroundColor,
  hoverBackgroundColor,
}) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useOutsideClickHandler(() => setIsOpen(false), container);

  backgroundColor = backgroundColor || "bg-slate-500";
  hoverBackgroundColor = hoverBackgroundColor || "hover:bg-slate-700";

  return (
    <>
      <div
        className={
          "inline-block" + (loading ? " opacity-50 cursor-not-allowed" : "")
        }
        ref={container}
      >
        <div className=" flex flex-col">
          <div
            onClick={() => !loading && setIsOpen(!isOpen)}
            className={
              "rounded relative inline text-white font-semibold cursor-pointer text-xs py-1 pl-2 px-1 " +
              backgroundColor
            }
          >
            {value}

            <ChevronDownIcon className="h-4 inline-block " />
          </div>

          <div className="relative inline h-1">
            {isOpen && (
              <div
                className={
                  "z-10 my-1 absolute _bg-white rounded min-w-full " +
                  backgroundColor
                }
              >
                {options.map((option, i) => (
                  <div
                    onClick={async () => {
                      if (loading) return;
                      setIsOpen(false);
                      if (onChange) {
                        setLoading(true);
                        await onChange(option);
                        setLoading(false);
                      }
                    }}
                    key={i}
                    className={
                      "my-[1px] rounded cursor-pointer text-white text-xs font-semibold px-2 py-1 " +
                      hoverBackgroundColor
                    }
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelector;
