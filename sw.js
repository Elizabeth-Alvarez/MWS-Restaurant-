//Installing event to cache specific files

  let restaurant_cache = 'mws-restaurant-part04';

  const urlToCache = [
    "/",
    "/index.html",
    "/restaurant.html",
    "/css/styles.css",
    "/js/dbhelper.js",
    "/js/idb.js",
    "/js/main.js",
    "/js/register.js",
    "/js/restaurant_info.js"
  ];

  //Open a cache
  self.addEventListener('install', function(event) {
    console.log("[serviceWorker] Installed");

    event.waitUntil(
      caches.open(restaurant_cache).then(function(cache) {
      return cache.addAll(urlToCache);
    })
  );
});

//Gather and eliminate caches that are not the restaurant_cache
self.addEventListener('activate', function(event) {
  console.log("[serviceWorker] Activated");

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-restaurant-part') && cacheName != restaurant_cache;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//fetch
self.addEventListener('fetch', function(event) {
  //Handles the issue of restaurant.html(id)
  console.log("[serviceWorker] Fetching");

  if(event.request.url.indexOf('restaurant.html') > -1) {
    event.respondWith(caches.match('restaurant.html'));
  }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        //Checks if response already exists in cache
        if(response) {
          console.log('[serviceWorker] Found in cache', event.request.url);
          return response;
        }
        //If not in cache, lets add it
        let cloneRequest = event.request.clone();
        fetch(cloneRequest).then(function(response) {
          if(!response) {
            console.log("[serviceWorker] No fetch response");
            return response;
          }

          let cloneResponse = response.clone();

          caches.open(restaurant_cache).then(function(cache) {
          //console.log(event.request);
          cache.put(event.request, cloneResponse);
          return response;
          });
        }).catch(function(error) {
          console.log('Fetch error', error);
        })
        return fetch(event.request);
      })
    );
}); //End of fetch listener
