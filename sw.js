if(!self.define){let e,s={};const i=(i,o)=>(i=new URL(i+".js",o).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(o,n)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let d={};const c=e=>i(e,a),r={module:{uri:a},exports:d,require:c};s[a]=Promise.all(o.map((e=>r[e]||c(e)))).then((e=>(n(...e),d)))}}define(["./workbox-7c2a5a06"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/melodie/_next/app-build-manifest.json",revision:"2cfa9a45c243825e0fc56d1fddc30c1d"},{url:"/melodie/_next/static/chunks/138-11dd9bb0acdc0533.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/212-458c8a7110a2089c.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/23-18bd33ec55af85d5.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/246-b40604fe8d231ee7.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/957-e723e8a7827f7279.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/_not-found/page-fdb4bf355409c12c.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/about/page-2e52beca69f9ed22.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/backing-track/page-0f020f8f4b30c47d.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/chords/page-537f6d877e676439.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/dashboard/page-76b663be13bc1afe.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/interval/page-4cd2a29dfe1f0f98.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/layout-7f8d27c30a17065b.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/melody/page-5341127714be37b8.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/page-e20a91fbbe650f76.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/app/test/page-e61ff8bc367f235c.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/ca377847-79272c511c6927cd.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/fd9d1056-23bdddb1df3a91c8.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/framework-f66176bb897dc684.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/main-55e54809b65dd083.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/main-app-b60db4808cb80b7f.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/melodie/_next/static/chunks/webpack-6a86250db9ed4f65.js",revision:"m21osVtHBW03smeLcVZpG"},{url:"/melodie/_next/static/css/379c346c8bece7f1.css",revision:"379c346c8bece7f1"},{url:"/melodie/_next/static/m21osVtHBW03smeLcVZpG/_buildManifest.js",revision:"2ec694eb52ae4f523f265a46bae4d768"},{url:"/melodie/_next/static/m21osVtHBW03smeLcVZpG/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/melodie/favicon.ico",revision:"f3c25005ddbc164f60f31b5aeb413ce5"},{url:"/melodie/icon.png",revision:"a41330a3d5ba72be88dbfd30c6d183e8"},{url:"/melodie/manifest.json",revision:"4eb84b5139b139b5f8f59102dc78d215"},{url:"/melodie/sounds/piano/A0.mp3",revision:"ae297c5adf385df57658e08f09c44e46"},{url:"/melodie/sounds/piano/A0.ogg",revision:"841ef4f6613375b36223d7798a1f3514"},{url:"/melodie/sounds/piano/A1.mp3",revision:"8a4cf5ae59d78ae1bf5d8ae2628cc7c0"},{url:"/melodie/sounds/piano/A1.ogg",revision:"9019d1bd7897988218f37200247e34b3"},{url:"/melodie/sounds/piano/A2.mp3",revision:"f30c6031e17463b32c6e8a3a8cf90fb4"},{url:"/melodie/sounds/piano/A2.ogg",revision:"192503d52553cdfa53843f2cc741300b"},{url:"/melodie/sounds/piano/A3.mp3",revision:"d83805c080f80bcee94d817e375d224f"},{url:"/melodie/sounds/piano/A3.ogg",revision:"e3167e60f5a429fd683a9a6dff9261f6"},{url:"/melodie/sounds/piano/A4.mp3",revision:"ac1793b11eb5472897c57a48897049ac"},{url:"/melodie/sounds/piano/A4.ogg",revision:"315ce00247ad935aae74c93991279dcc"},{url:"/melodie/sounds/piano/A5.mp3",revision:"07a5bfc6f2d22a1f0ce18831131bc079"},{url:"/melodie/sounds/piano/A5.ogg",revision:"d94b639778820449d9dcb6755adf7aae"},{url:"/melodie/sounds/piano/A6.mp3",revision:"7a848d96c5a03ba7f5655f28a17df7df"},{url:"/melodie/sounds/piano/A6.ogg",revision:"95d5c66999e1dc8081353513b86da143"},{url:"/melodie/sounds/piano/A7.mp3",revision:"dfbb0274be3ec0e6e43dd24741523063"},{url:"/melodie/sounds/piano/A7.ogg",revision:"871e9275ddad88247cf48826e3747f81"},{url:"/melodie/sounds/piano/C1.mp3",revision:"18e7a4f7075948ab503e70fc812e72c1"},{url:"/melodie/sounds/piano/C1.ogg",revision:"9bd224a83864b7eae9ac1cae84a1ce38"},{url:"/melodie/sounds/piano/C2.mp3",revision:"fea0b1f393117812f9a00519d59bdc73"},{url:"/melodie/sounds/piano/C2.ogg",revision:"4c4670a2e5e78598d3bdb388f016d5fb"},{url:"/melodie/sounds/piano/C3.mp3",revision:"e2e4c48c62a94d3d3d0cc0b070d0c8bd"},{url:"/melodie/sounds/piano/C3.ogg",revision:"f44050689f1952514a5adaba6ed8d221"},{url:"/melodie/sounds/piano/C4.mp3",revision:"2f496ec3fdce5db3d2da548ce21be91d"},{url:"/melodie/sounds/piano/C4.ogg",revision:"688caeb834aca3b2a0d0156a1ac8d80f"},{url:"/melodie/sounds/piano/C5.mp3",revision:"0d1e316ab0853d4b25ad7009e5e71716"},{url:"/melodie/sounds/piano/C5.ogg",revision:"5e36078090de834ac37be6acd999a2ae"},{url:"/melodie/sounds/piano/C6.mp3",revision:"8420f29f45dcb16e70d6e182c4f49154"},{url:"/melodie/sounds/piano/C6.ogg",revision:"334940197fbb88608e4b6867e0e60165"},{url:"/melodie/sounds/piano/C7.mp3",revision:"a5d1aa5ac7e4a07e8b5d460bd0cc813f"},{url:"/melodie/sounds/piano/C7.ogg",revision:"7cc9323319c221f1aa2e0a0c877a5bcd"},{url:"/melodie/sounds/piano/C8.mp3",revision:"cb23085ea092ccfc2bae4d15937329cc"},{url:"/melodie/sounds/piano/C8.ogg",revision:"58e76fb3917caacf64efd4c4391c8ff2"},{url:"/melodie/sounds/piano/Ds1.mp3",revision:"f5208d1a95e8438193d2771b5e2b81a4"},{url:"/melodie/sounds/piano/Ds1.ogg",revision:"1dbb7c93d16b5a0db15daa4e7da44aab"},{url:"/melodie/sounds/piano/Ds2.mp3",revision:"8bb122604c4241b5c470958303f7314e"},{url:"/melodie/sounds/piano/Ds2.ogg",revision:"16cbb9ac5a61dff10411497e79e0c495"},{url:"/melodie/sounds/piano/Ds3.mp3",revision:"84bb9c0a39a515d87d90751ebd355085"},{url:"/melodie/sounds/piano/Ds3.ogg",revision:"61dc13f79fb35be972b3c4ab43c1909d"},{url:"/melodie/sounds/piano/Ds4.mp3",revision:"88ae883ad007a298010a5974db74ba53"},{url:"/melodie/sounds/piano/Ds4.ogg",revision:"23823de9b844b2ef0aabf51978cadb60"},{url:"/melodie/sounds/piano/Ds5.mp3",revision:"94e49f1403865e6e74b748bc206e32a6"},{url:"/melodie/sounds/piano/Ds5.ogg",revision:"4f2bfbf1fbfa86e7d7dd30dc2e11cce6"},{url:"/melodie/sounds/piano/Ds6.mp3",revision:"93db6bd355ed9970ad4d6e3a4fe2860d"},{url:"/melodie/sounds/piano/Ds6.ogg",revision:"2f95e48ec53604e05bebb2024de1109c"},{url:"/melodie/sounds/piano/Ds7.mp3",revision:"0e00cb46fef90113657ee395ffd0d423"},{url:"/melodie/sounds/piano/Ds7.ogg",revision:"b31ff93f80be187a8ee7687b82bff9cd"},{url:"/melodie/sounds/piano/Fs1.mp3",revision:"8380198ef0d1b1edc3b2390c51ecc6e8"},{url:"/melodie/sounds/piano/Fs1.ogg",revision:"703c56de1e081c2c4feee4a6328ab0ee"},{url:"/melodie/sounds/piano/Fs2.mp3",revision:"86039a11bfdaf9ddfbba95a195c94d5b"},{url:"/melodie/sounds/piano/Fs2.ogg",revision:"b592ede10e87fefca735add792fbf398"},{url:"/melodie/sounds/piano/Fs3.mp3",revision:"d9e8459da3320131e5a39155c2f86278"},{url:"/melodie/sounds/piano/Fs3.ogg",revision:"77482d0bae3153b9b5ba29d8213075f9"},{url:"/melodie/sounds/piano/Fs4.mp3",revision:"210c4652fcf4a271a12d91fb3b1b7247"},{url:"/melodie/sounds/piano/Fs4.ogg",revision:"5e43b72ee189efa47dfed3b5825e3e3c"},{url:"/melodie/sounds/piano/Fs5.mp3",revision:"3a213fc21fa03d96c5706f5c54353c10"},{url:"/melodie/sounds/piano/Fs5.ogg",revision:"fbf2c6a10b8429a09ef861a7b79f3999"},{url:"/melodie/sounds/piano/Fs6.mp3",revision:"99903cce422eadff5f93ad762ba3502a"},{url:"/melodie/sounds/piano/Fs6.ogg",revision:"edfeeb8bf07fd81890b20768e02ddd2e"},{url:"/melodie/sounds/piano/Fs7.mp3",revision:"01e61f3e5216b85ad25c61a0b658ed3c"},{url:"/melodie/sounds/piano/Fs7.ogg",revision:"d21328e48eb3eed558dd5c17d75a72c1"},{url:"/melodie/sounds/piano/README",revision:"62d394ed57833f096315d055d3fbfd2a"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/melodie",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:o})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
