import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#050505",
          50: "#F6F3EE",
          100: "#EAE3D6",
          700: "#181512",
          800: "#0E0D0B",
          900: "#050505",
          950: "#000000"
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FFF7D6",
          100: "#F8E8A8",
          200: "#EBD074",
          300: "#D4AF37",
          400: "#B98F20",
          500: "#8C6616"
        },
        champagne: "#F7F1E5",
        pearl: "#FDFBF7",
        oxblood: "#671421"
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
        display: ["Bodoni 72", "Didot", "Georgia", "serif"]
      },
      boxShadow: {
        "gold-soft": "0 24px 70px rgba(212, 175, 55, 0.16)",
        "noir": "0 28px 80px rgba(0, 0, 0, 0.48)"
      },
      backgroundImage: {
        "luxury-radial":
          "radial-gradient(circle at 18% 20%, rgba(212, 175, 55, 0.22), transparent 28%), radial-gradient(circle at 82% 10%, rgba(103, 20, 33, 0.24), transparent 32%)",
        "noir-glow":
          "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.01))"
      }
    }
  },
  plugins: []
};

export default config;
