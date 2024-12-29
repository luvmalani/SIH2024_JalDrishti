/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
	],
	
	theme: {
		extend: {
			colors: {
				customBlue: 'rgb(82, 95, 127)', // Tumhara color yaha add karo
			  },
			  fontFamily: {
				santoshi: ['Santoshi', 'sans-serif'],
			  },
		
		},
	},
	plugins: [],
};
