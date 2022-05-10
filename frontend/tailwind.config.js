module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mintGreen: "#a7f3d0",
        darkGray: "#374151",
        medGray: "#6b7280",
        XLightGray: "#f1f5f9",
        lightGray: "#cbd5e1",
        green: "#22c55e",
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      display: ["group-hover"],
      opacity: ["disabled"],
    },
  },
};
