import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Bao gồm tất cả file trong src với các phần mở rộng
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;