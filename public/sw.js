// const dynamicCacheName = "site-dynamic-v1.0";
// const staticCacheName = "site-static-v1.0";

// const assets = [
// //   "/",
//   "./",
//   "./index.html",
//   "./js/app.js",
//   "./js/mj.js",
//   "./js/db.js",
//   "./js/nouislider.js",
//   "./js/materialize.min.js",
//   "./css/styles.css",
//   "./css/materialize.min.css",
//   "https://fonts.googleapis.com/icon?family=Material+Icons",
//   "https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
//   "./pages/fallback.html",
//   "./pages/mj.html",
//   "./css/nouislider.css",
// //   "./img/*",

// ];

// // cache size limit function
// const limitCacheSize = (name, size) => {
//   caches.open(name).then((cache) => {
//     cache.keys().then((keys) => {
//       if (keys.length > size) {
//         cache.delete(keys[0]).then(limitCacheSize(name, size));
//       }
//     });
//   });
// };

// // install event
// self.addEventListener("install", (evt) => {
// //   console.log("service worker installed");
//   evt.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//     //   console.log("Opened cache");
//       cache.addAll(assets);
//     })
//     // .then(self.skipWaiting())
//   );
// });

// // activate event
// self.addEventListener("activate", (evt) => {
//   console.log("service worker activated");
//   evt.waitUntil(
//     caches.keys().then((keys) => {
//       //console.log(keys);
//       return Promise.all(
//         keys
//           .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
//           .map((key) => caches.delete(key))
//       );
//     })
//   );
// });

// // // fetch events
// self.addEventListener("fetch", (evt) => {
//   if (evt.request.url.indexOf("firestore.googleapis.com") === -1) {
//     evt.respondWith(
//       caches
//         .match(evt.request)
//         .then((cacheRes) => {
//           return (
//             cacheRes ||
//             fetch(evt.request).then((fetchRes) => {
//               return caches.open(dynamicCacheName).then((cache) => {
//                 cache.put(evt.request.url, fetchRes.clone());
//                 // check cached items size
//                 limitCacheSize(dynamicCacheName, 25);
//                 return fetchRes;
//               });
//             })
//           );
//         })
//         .catch((err) => {
//         //   console.log(err);
//         //   console.log(evt.request);
//         //   console.log(evt.request.url);
//         //   console.log(evt.request.url.indexOf(".html"));

//           if (evt.request.url.indexOf(".html") > -1) {
//             return caches.match("./pages/fallback.html");
//           }
//         })
//     );
//   }
// });
