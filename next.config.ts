import type { NextConfig } from "next";

// GitHub Pages serves project sites from /<repo-name>/, so the base path
// only applies in that build (set by the deploy workflow), never in local dev.
const repoName = "cherith-water-vendo";
const forGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: forGithubPages ? `/${repoName}` : "",
  assetPrefix: forGithubPages ? `/${repoName}/` : "",
};

export default nextConfig;