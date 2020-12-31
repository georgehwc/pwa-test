const dynamicCacheName = "site-dynamic-v2.0";
const staticCacheName = "site-static-v2.0";

const assets = [
  //   "/",
  "./",
  "./index.html",
  "./404.html",
  "./js/app.js",
  "./js/mj.js",
  "./js/db.js",
  "./js/nouislider.js",
  "./js/materialize.min.js",
  "./css/styles.css",
  "./css/materialize.min.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "./pages/fallback.html",
  "./pages/mj.html",
  "./css/nouislider.css",
  //   "./img/*",

];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener("install", (evt) => {
  //   console.log("service worker installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      //   console.log("Opened cache");
      cache.addAll(assets);
    })
    // .then(self.skipWaiting())
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  console.log("service worker activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

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
//               // console.log(fetchRes.status);
//               // if (response.status === 404) {
//               //   return caches.match('pages/404.html');
//               // }

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
//             console.log(err);
//           //   console.log(evt.request);
//           //   console.log(evt.request.url);
//           //   console.log(evt.request.url.indexOf(".html"));

//           if (evt.request.url.indexOf("/index.html/index.html") > -1) {
//             return window.location.href = "https://pwa-mj.web.app/";
//           }

//           if (evt.request.url.indexOf(".html") > -1) {
//             return caches.match("./pages/fallback.html");
//           }
//         })
//     );
//   }
// });

self.addEventListener('fetch', event => {
  if (event.request.url.indexOf("firestore.googleapis.com") === -1 || event.request.url.indexOf("google-analytics.com/g/collect") === -1) {
    // console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // console.log('Found ', event.request.url, ' in cache');
            return response;
          }
          // console.log('Network request for ', event.request.url);
          return fetch(event.request)
            .then(response => {
              // console.log(response.status);
              if (response.status === 404) {
                // console.log("404");
                return caches.match('./404.html');
              }
              return caches.open(dynamicCacheName)
                .then(cache => {
                  cache.put(event.request.url, response.clone());
                  limitCacheSize(dynamicCacheName, 50);
                  return response;
                });
            });
        }).catch(error => {
          console.log('Error, ', error);
          return caches.match('./');
        })
    );
  }
});