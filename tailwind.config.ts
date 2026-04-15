import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Malgun Gothic"',
          '"Apple SD Gothic Neo"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
