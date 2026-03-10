/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
    output: "export",
    trailingSlash: true,
    basePath: process.env.NODE_ENV === "production" ? "/melodie" : "",
    turbopack: {
        root: resolve(__dirname),
    },
};

export default config;
