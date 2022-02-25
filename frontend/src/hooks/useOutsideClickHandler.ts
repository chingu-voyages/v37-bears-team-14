import { RefObject, useEffect } from "react";

export default function useOutsideClickHandler(
  handler: () => void,
  ref: RefObject<HTMLElement>
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target as any)) {
        handler();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchdown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchdown", handleClickOutside);
    };
  }, [ref, handler]);
}
