module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2D683E",
        secondary: "#deffd2",
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
