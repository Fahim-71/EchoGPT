import type { NextConfig } from "next";

/**
 * Two build targets share this config:
 *
 *  - `npm run build`           → hosted showcase (Vercel). Absolute asset paths.
 *  - `npm run build:extension` → Chrome MV3 bundle. Sets ECHOGPT_EXT_BUILD=1 so
 *    the exported HTML references `./_next/...` instead of `/_next/...`.
 *    Extension pages are loaded from `chrome-extension://<id>/popup.html`, where
 *    a leading slash resolves to the extension root — which mostly works — but
 *    webpack's runtime publicPath must match too, so we set assetPrefix rather
 *    than string-replacing the HTML alone.
 */
const isExtensionBuild = process.env.ECHOGPT_EXT_BUILD === "1";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
  ...(isExtensionBuild ? { assetPrefix: "./" } : {}),
};

export default nextConfig;
