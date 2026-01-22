import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        // This makes 'font-lush' work
        lush: ['var(--font-lush-reg)'], 
        
        // This makes 'font-script' work 
        script: ['var(--font-lush-script)'], 

        swirl: ['var(--font-lswirl)'],
      },
    },
  },
  plugins: [],
};
export default config;