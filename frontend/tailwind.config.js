/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "neon-magenta": "#FF00FF",
        "neon-cyan": "#00FFFF",
        "neon-yellow": "#FFFF00",
        "neon-green": "#00FF41",
        "neon-orange": "#FF6B00",
        "neon-pink": "#FF69B4",
        void: "#0a0a0f",
        "void-light": "#12121a",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        mono: ['"Courier New"', "Courier", "monospace"],
      },
      fontSize: {
        "pixel-xs": "0.5rem",
        "pixel-sm": "0.625rem",
        "pixel-md": "0.75rem",
        "pixel-lg": "1rem",
        "pixel-xl": "1.25rem",
      },
      animation: {
        "neon-pulse": "neonPulse 2s ease-in-out infinite",
        flicker: "flicker 3s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": {
            boxShadow: "0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 20px #FF00FF",
          },
          "50%": {
            boxShadow: "0 0 10px #FF00FF, 0 0 25px #FF00FF, 0 0 50px #FF00FF",
          },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: 1 },
          "20%, 24%, 55%": { opacity: 0.4 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        "neon-magenta": "0 0 5px #FF00FF, 0 0 20px #FF00FF, 0 0 40px #FF00FF",
        "neon-cyan": "0 0 5px #00FFFF, 0 0 20px #00FFFF, 0 0 40px #00FFFF",
        "neon-yellow": "0 0 5px #FFFF00, 0 0 20px #FFFF00, 0 0 40px #FFFF00",
        "neon-green": "0 0 5px #00FF41, 0 0 20px #00FF41, 0 0 40px #00FF41",
      },
    },
  },
  plugins: [],
};
