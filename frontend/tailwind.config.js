module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // colors: {
    //   darkGrey: "#1f2937",
    //   white: "#f3f4f6",
    // #a7f3d0
    // },
    extend: {
      colors: {
        mintGreen: "#a7f3d0",
        darkGray: "#374151",
        medGray: "#6b7280",
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
};
