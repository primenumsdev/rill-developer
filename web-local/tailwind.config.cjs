module.exports = {
  /** Once we have applied dark styling to all UI elements, remove this line */
  darkMode: 'class',
  content: [
    "./**/*.html",
    "./**/*.svelte",
    "./src/lib/duckdb-data-types.ts",
    "./src/lib/components/chip/chip-types.ts"
  ],
  theme: {
    extend: {
      colors: {
        'trendy-pink': {
          DEFAULT: '#755483',
          '50': '#EEE5EB',
          '100': '#E3D3E0',
          '200': '#CDB1CB',
          '300': '#B68FB7',
          '400': '#996DA2',
          '500': '#755483',
          '600': '#59446A',
          '700': '#403451',
          '800': '#2A2438',
          '900': '#16141F'
        },
      }
    },
  },
  plugins: [],
  safelist: [
    'text-blue-800', // needed for blue text in filter pills
  ]
};
