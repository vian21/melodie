/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import nextPWA from "next-pwa";

const { AlphaTabWebPackPlugin } = await import("@coderline/alphatab-webpack");

const withPWA = nextPWA({
    dest: "public",
    reloadOnOnline: true,
    cacheOnFrontEndNav: true,
    disable: process.env.NODE_ENV === "development" ? true : false,
});

const config = withPWA({
    output: "export",
    trailingSlash: true,
    basePath: process.env.NODE_ENV === "production" ? "/melodie" : "",
    eslint: {
        ignoreDuringBuilds: false,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.plugins.push(new AlphaTabWebPackPlugin());
        }
        return config;
    },
});

export default config;
