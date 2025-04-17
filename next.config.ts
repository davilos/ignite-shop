import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "files.stripe.com",
				port: "",
				pathname: "/**",
				search: "",
			},
		],
	},
};

export default nextConfig;
