import type { NextConfig } from "next";

const nextConfig: NextConfig = process.env.PORTFOLIO_PAGES_BUILD === "1" ? {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_PORTFOLIO_BASE_PATH || "",
} : {};

export default nextConfig;
