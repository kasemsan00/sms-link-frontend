module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(219 56 102)",
        end: "rgb(31 77 46)",
        primaryGreen: "rgb(31 77 46)",
        "primary-text": "#1f4d2e",
        secondary: "rgb(251 235 241)",
        "nstda-color": "rgb(48, 106, 179)",
        focus: "#1f4d2e",
        "video-call": "#190b1a",
        "video-control": "rgba(25, 11, 26, 0.3)",
        "chat-page": "#BBCDF8",
        "chat-user-local": "#4C7ED4",
        "chat-realtime-preview": "#a84e32",
      },
    },
    screens: {
      mobileSE: "375px",
      mobile: "390px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [require("daisyui")],
};
