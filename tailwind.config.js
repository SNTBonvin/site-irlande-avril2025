export default {
    darkMode: 'class',
    content: ['./src/**/*.{astro,js,ts,jsx,tsx}'],
    safelist: [
      'dark',
      'dark:bg-gray-900',
      'dark:text-white',
      'dark:bg-gray-800',
      'dark:text-gray-300',
      'dark:text-green-300',
      'grid-cols-1',
      'sm:grid-cols-2',
      'md:grid-cols-3',
    ],
    theme: {
      extend: {},
    },
    plugins: [require('@tailwindcss/typography')],

  };
  