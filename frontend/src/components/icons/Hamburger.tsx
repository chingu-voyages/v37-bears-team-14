import React from "react";

function Hamburger() {
  return (
    <svg
      className="w-6 h-6 text-emerald-200"
      x-show="!showMenu"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  );
}

export default Hamburger;
