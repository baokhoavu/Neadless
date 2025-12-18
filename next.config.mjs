/** @type {import('next').NextConfig} */
const nextConfig = {
	outputFileTracingRoot: __dirname,

	// Optimize Contentful images
	images: {
		domains: ["images.ctfassets.net"], // Contentful CDN
		formats: ["image/webp", "image/avif"],
	},

	// Experimental features for better caching
	experimental: {
		// Enable optimizePackageImports for better tree shaking
		optimizePackageImports: ["@contentful/rich-text-react-renderer"],
	},

	// Configure fetch cache for external APIs
	fetchCache: "default-cache",

	// Logging for debugging cache issues
	logging: {
		fetches: {
			fullUrl: process.env.NODE_ENV === "development",
		},
	},
};

export default nextConfig;
