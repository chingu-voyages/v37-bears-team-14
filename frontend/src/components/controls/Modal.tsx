import { FC } from "react";

interface ModalProps {
  children?: any;
  onClose?: () => void;
}

const Modal: FC<ModalProps> = ({ onClose, children }) => {
  return (
    <>
      <div
        onClick={onClose}
        className="fixed z-10 top-0 left-0 h-screen w-screen backdrop-blur-sm"
      ></div>
      <div className="fixed z-10 inset-0 overflow-y-auto max-w-3xl mx-auto w-full">
        <div className="bg-white mx-2 my-4 p-4 rounded-lg">{children}</div>
      </div>
    </>
  );
};

export default Modal;
