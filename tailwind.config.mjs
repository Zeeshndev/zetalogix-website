/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				// Inter for highly readable body text
				sans: ['"Inter Variable"', 'sans-serif'],
				// Space Grotesk for technical, premium headings
				heading: ['"Space Grotesk Variable"', 'sans-serif'], 
			},
			colors: {
				brand: {
					dark: '#020617',  // Deep premium slate background
					accent: '#22d3ee', // Technical Cyan accent
					glow: '#10b981',   // Sleek Emerald glow
				}
			}
		},
	},
	plugins: [],
}