import { createReadStream, existsSync, statSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const basePath = "/melodie";
const outDir = resolve("out");

/** @type {Record<string, string>} */
const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".ttf": "font/ttf",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".xml": "application/xml; charset=utf-8",
};

if (!existsSync(outDir)) {
    console.error("Missing ./out. Run `npm run build` first.");
    process.exit(1);
}

/**
 * @param {import("node:http").ServerResponse} res
 * @param {string} filePath
 */
function sendFile(res, filePath) {
    const ext = extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    createReadStream(filePath).pipe(res);
}

/**
 * @param {import("node:http").ServerResponse} res
 * @param {number} statusCode
 * @param {string} message
 */
function sendStatus(res, statusCode, message) {
    res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(message);
}

/**
 * @param {string} urlPath
 * @returns {string | null}
 */
function resolvePath(urlPath) {
    const relativePath = urlPath.slice(basePath.length).replace(/^\/+/, "");
    const safePath = normalize(relativePath).replace(/^([.][.][/\\])+/, "");
    const fullPath = resolve(join(outDir, safePath));

    if (!fullPath.startsWith(outDir)) {
        return null;
    }

    return fullPath;
}

function getServerUrls() {
    const urls = [`http://localhost:${port}${basePath}/`];
    const interfaces = networkInterfaces();

    Object.values(interfaces).forEach((addresses) => {
        addresses?.forEach((address) => {
            if (address.family !== "IPv4" || address.internal) {
                return;
            }

            urls.push(`http://${address.address}:${port}${basePath}/`);
        });
    });

    return Array.from(new Set(urls));
}

createServer(
    /**
     * @param {import("node:http").IncomingMessage} req
     * @param {import("node:http").ServerResponse} res
     */
    (req, res) => {
        if (!req.url) {
            sendStatus(res, 400, "Bad Request");
            return;
        }

        const requestUrl = new URL(
            req.url,
            `http://${req.headers.host || `${host}:${port}`}`
        );
        const pathname = requestUrl.pathname;

        if (pathname === "/") {
            res.writeHead(302, { Location: `${basePath}/` });
            res.end();
            return;
        }

        if (!pathname.startsWith(basePath)) {
            sendStatus(res, 404, "Not Found");
            return;
        }

        let filePath = resolvePath(pathname);

        if (!filePath) {
            sendStatus(res, 403, "Forbidden");
            return;
        }

        if (existsSync(filePath) && statSync(filePath).isDirectory()) {
            filePath = join(filePath, "index.html");
        }

        if (!existsSync(filePath) && !extname(filePath)) {
            const htmlPath = `${filePath}.html`;
            if (existsSync(htmlPath)) {
                filePath = htmlPath;
            }
        }

        if (!existsSync(filePath)) {
            const notFoundPath = join(outDir, "404.html");
            if (existsSync(notFoundPath)) {
                res.writeHead(404, {
                    "Content-Type": "text/html; charset=utf-8",
                });
                createReadStream(notFoundPath).pipe(res);
                return;
            }

            sendStatus(res, 404, "Not Found");
            return;
        }

        sendFile(res, filePath);
    }
).listen(port, host, () => {
    console.log(`Serving site at:`);
    getServerUrls().forEach((url) => {
        console.log(`\t→ ${url}`);
    });
});
