/** @type {import('next').NextConfig} */
export const baseConfig = {
	reactStrictMode: true,

	eslint: {
		ignoreDuringBuilds: true,
	},

	typescript: {
		ignoreBuildErrors: true,
	},

	trailingSlash: true,
	output: "export",

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
				port: "",
				pathname: "/**",
			},
		],
		// Allow direct external image URLs (for next/image)
		unoptimized: true,
	},
};
