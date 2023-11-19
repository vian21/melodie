/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
    output:'export',
    trailingSlash: true,
    basePath: process.env.NODE_ENV === "production" ? "/melodie" : "",
};

export default config;
