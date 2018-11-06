//Installing event to cache specific files

let restaurant_cache = 'mws-restaurant-final';
let restaurantImg_cache = 'mws-restaurant-images';

let bothCache = [
  restaurant_cache,
  restaurantImg_cache
];

const urlToCache = [
  "/",
  "/restaurant.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/dbhelper.js",
  "/js/idb.js",
  "/js/lazysizes.min.js",
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
          return cacheName.startsWith('mws-restaurant-part') && !bothCache.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


/*
self.addEventListener('fetch', function(event) {
  console.log("[serviceWorker] Fetching");
  const requestUrl = new URL(event.request.url);
  // respond with cache if found, else cache asset
  if(requestUrl.origin === location.origin) {
    //Handles the issue of restaurant.html(id)
    //if(event.request.url.indexOf('restaurant.html') > -1) {
      if(requestUrl.pathname.startsWith('/restaurant.html')) {
        event.respondWith(caches.match('/restaurant.html'));
        return;
      } //End of if statement

    if(requestUrl.pathname.startsWith('/img')) {
      event.respondWith(cacheImage(event.request));
      return;
    }
  } //End of origin if statement
  // Default behavior: respond with cached elements, if any, falling back to network.
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );

});//End of fetch listener
*/
/*
//fetch
self.addEventListener('fetch', function(event) {
    console.log("[serviceWorker] Fetching");
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    //Handles the issue of restaurant.html(id)
    //if(event.request.url.indexOf('restaurant.html') > -1) {
    if(requestUrl.pathname.startsWith('/restaurant.html')) {
      event.respondWith(caches.match('/restaurant.html'));
      return;
      //event.respondWith(cache(event.request));
    }
    if(requestUrl.pathname.startsWith('/img')) {
      event.respondWith(cacheImage(event.request));
      return;
    }
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
  /*event.respondWith(
    caches.match(event.request).then(function(response) {
      //Checks if response already exists in cache
      if(response) {
        console.log('[serviceWorker] Found in cache', event.request.url);
        return response || fetch(event.request);
      }
      //If not in cache, lets add it
      let cloneRequest = event.request.clone();
      fetch(cloneRequest).then(function(response) {
        if(!response) {
          console.log("[serviceWorker] No fetch response");
          return response;
        }

        let cloneResponse = response.clone();
        return caches.open(restaurant_cache).then(function(cache) {
          //console.log(event.request);
          cache.put(event.request, cloneResponse);
          return response;
        });
      }).catch(function(error) {
        console.log('Fetch error', error);
      })
      //return fetch(event.request);
    })
  );*
}); //End of fetch listener

function cache(request) {
  let restaurantUrl = request.url;

  return caches.open(restaurant_cache).then(function(cache) {
    return cache.match(restaurantUrl).then(function(response) {
      // if image is in cache, return it, else fetch from network, cache a clone, then return network response
      return response || fetch(request).then(function(networkResponse) {
        cache.put(restaurantUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

function cacheImage(request) {
  let imageUrl = request.url;
  // Make a new URL with a stripped suffix and extension from the request url
  // i.e. /img/1-medium.jpg  will become  /img/1
  imageUrl = imageUrl.replace(/_small\.\w{3}|_reg\.\w{3}/i, '');

  return caches.open(restaurantImg_cache).then(function(cache) {
    return cache.match(imageUrl).then(function(response) {
      // if image is in cache, return it, else fetch from network, cache a clone, then return network response
      return response || fetch(request).then(function(networkResponse) {
        cache.put(imageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
*/


self.addEventListener('fetch', function(event) {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request).then(function(response) {
        if (response.status === 404) {
        console.log("[serviceWorker] No fetch response");
        return response;
        }
        return caches.open(restaurant_cache).then(function(cache) {
          if (event.request.url.indexOf('/restaurant.html') > -1) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    }).catch(function(error) {
      console.log('Error, ', error);
      //return fetch(event.response);
    })
  );
});
