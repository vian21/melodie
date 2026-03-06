#!/usr/bin/env node

/**
 * Scans public/data/licks/*.alphatex, extracts frontmatter,
 * and writes public/data/licks/index.json
 */

const fs = require("fs");
const path = require("path");

const LICKS_DIR = path.resolve(__dirname, "../public/data/licks");
const INDEX_PATH = path.join(LICKS_DIR, "index.json");

const REQUIRED_FIELDS = ["id", "title", "tags", "tempo", "key"];

function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;

    const raw = match[1];
    const meta = {};

    for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const colonIdx = trimmed.indexOf(":");
        if (colonIdx === -1) continue;

        const key = trimmed.slice(0, colonIdx).trim();
        let value = trimmed.slice(colonIdx + 1).trim();

        // Parse arrays: [a, b, c]
        if (value.startsWith("[") && value.endsWith("]")) {
            value = value
                .slice(1, -1)
                .split(",")
                .map((s) => s.trim());
        }
        // Parse numbers
        else if (/^\d+(\.\d+)?$/.test(value)) {
            value = parseFloat(value);
        }

        meta[key] = value;
    }

    return meta;
}

function validate(meta, filename) {
    const errors = [];
    for (const field of REQUIRED_FIELDS) {
        if (
            meta[field] === undefined ||
            meta[field] === null ||
            meta[field] === ""
        ) {
            errors.push(`Missing required field: ${field}`);
        }
    }
    if (meta.tags && !Array.isArray(meta.tags)) {
        errors.push(`'tags' must be an array`);
    }
    if (meta.tempo && typeof meta.tempo !== "number") {
        errors.push(`'tempo' must be a number`);
    }
    if (errors.length > 0) {
        console.error(`Validation errors in ${filename}:`);
        errors.forEach((e) => console.error(`  - ${e}`));
        return false;
    }
    return true;
}

function main() {
    if (!fs.existsSync(LICKS_DIR)) {
        console.error(`Licks directory not found: ${LICKS_DIR}`);
        process.exit(1);
    }

    const files = fs
        .readdirSync(LICKS_DIR)
        .filter((f) => f.endsWith(".alphatex"))
        .sort();

    const index = [];
    let hasErrors = false;

    for (const file of files) {
        const filePath = path.join(LICKS_DIR, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const meta = parseFrontmatter(content);

        if (!meta) {
            console.error(`No frontmatter found in ${file}`);
            hasErrors = true;
            continue;
        }

        if (!validate(meta, file)) {
            hasErrors = true;
            continue;
        }

        index.push({
            id: meta.id,
            title: meta.title,
            tags: meta.tags,
            tempo: meta.tempo,
            key: meta.key,
            path: `/data/licks/${file}`,
        });
    }

    if (hasErrors) {
        console.error("Index generation completed with errors.");
    }

    fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + "\n");
    console.log(`Generated ${INDEX_PATH} with ${index.length} lick(s).`);
}

main();
