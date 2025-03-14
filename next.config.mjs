import TerserPlugin from "terser-webpack-plugin";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "smstest.expertel.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add the plugin only on the server
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Delete all console.log
            },
          },
        })
      );
    }
    return config;
  },
  //output: "export",
};

export default nextConfig;
