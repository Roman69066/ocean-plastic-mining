import type { NextConfig } from "next";
const config: NextConfig = {
  trailingSlash: true,
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  experimental: { globalNotFound: true },
};
export default config;
