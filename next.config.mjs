/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import nextPWA from "next-pwa";

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
});

export default config;
