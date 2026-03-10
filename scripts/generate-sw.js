#!/usr/bin/env node

/**
 * Generates a precache service worker for the static export.
 *
 * Uses workbox-build to scan the `out/` directory, then injects the
 * precache manifest into a minimal service-worker template so the
 * app works fully offline.
 */

const { injectManifest } = require("workbox-build");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.resolve(__dirname, "..", "out");
const SW_SRC = path.resolve(__dirname, "sw-template.js");
const SW_DEST = path.join(OUT_DIR, "sw.js");

async function main() {
    // Make sure the output directory exists (next build should have created it)
    if (!fs.existsSync(OUT_DIR)) {
        console.error(
            "Error: out/ directory not found. Run `next build` first."
        );
        process.exit(1);
    }

    const { count, size, warnings } = await injectManifest({
        swSrc: SW_SRC,
        swDest: SW_DEST,
        globDirectory: OUT_DIR,
        globPatterns: [
            "**/*.{js,mjs,css,html,png,jpg,jpeg,svg,ico,woff,woff2,eot,otf,json,sf2,mp3,ogg,alphatex}",
        ],
        // Don't cache the service worker itself or source maps
        globIgnores: ["sw.js", "**/*.map"],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20MB for soundfont
    });

    if (warnings.length > 0) {
        console.warn("Warnings:", warnings.join("\n"));
    }

    console.log(
        `Generated service worker: ${count} files precached (${(size / 1024 / 1024).toFixed(2)} MB)`
    );
}

main().catch((err) => {
    console.error("Failed to generate service worker:", err);
    process.exit(1);
});
