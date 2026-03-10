/**
 * Service-worker template.
 *
 * workbox-build replaces the injection point below with the actual
 * precache manifest at build time via injectManifest().
 */

// Import Workbox from CDN (workbox-sw handles loading individual modules)
importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js"
);

const { precacheAndRoute } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;

// Precache all static assets from the build
precacheAndRoute(self.__WB_MANIFEST);

// Cache Google Fonts (if any)
registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new CacheFirst({
        cacheName: "google-fonts-stylesheets",
    })
);

registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            }),
        ],
    })
);

// Take control immediately
self.skipWaiting();
self.clients.claim();
