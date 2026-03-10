#!/usr/bin/env node

/**
 * Copies alphaTab font and soundfont assets into public/
 * so they are available in the static export.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ALPHATAB_DIST = path.join(ROOT, "node_modules/@coderline/alphatab/dist");

const copies = [
    {
        src: path.join(ALPHATAB_DIST, "font"),
        dest: path.join(ROOT, "public/font"),
        filter: (f) => f.startsWith("Bravura."),
    },
    {
        src: path.join(ALPHATAB_DIST, "soundfont"),
        dest: path.join(ROOT, "public/soundfont"),
        filter: (f) => f === "sonivox.sf2",
    },
    // Copy ESM worker/worklet files so they can be served as static assets.
    // Turbopack cannot resolve the ESM worker entry points that alphaTab
    // expects, so we serve these from public/ and override
    // Environment.createWebWorker at runtime.
    {
        src: ALPHATAB_DIST,
        dest: path.join(ROOT, "public/alphatab"),
        filter: (f) =>
            f === "alphaTab.mjs" ||
            f === "alphaTab.core.mjs" ||
            f === "alphaTab.worker.mjs" ||
            f === "alphaTab.worklet.mjs",
    },
];

for (const { src, dest, filter } of copies) {
    if (!fs.existsSync(src)) {
        console.warn(`Source not found, skipping: ${src}`);
        continue;
    }

    fs.mkdirSync(dest, { recursive: true });

    const files = fs.readdirSync(src).filter(filter);
    for (const file of files) {
        fs.copyFileSync(path.join(src, file), path.join(dest, file));
    }
    console.log(`Copied ${files.length} file(s) to ${dest}`);
}
