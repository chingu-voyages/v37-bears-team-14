import React from "react";

export default function Alert(props: any) {
  return (
    <div
      className="fixed bottom-0 left-0 m-2 rounded-md bg-blue-500 text-white text-sm font-bold px-4 py-3 "
      role="alert"
    >
      <p>{props.message}</p>
    </div>
  );
}
