/**
 * Common database helper functions.
 */
var dbPromise = null;
var idbApp = (function() {
  'use strict';
 //Check to see if IndexedDB is supported by browser
 if(!('indexedDB' in window)) {
   console.log('This browser doesn\'t support IndexedDB');
   return;
 }

 //Create Database called 'restaurantDB'
  dbPromise = idb.open('restaurantDB', 3, upgradeDB => {
   //switch cases created to update DB
   console.log('Creates a restaurant database');
   switch (upgradeDB.oldVersion) {
     case 0:

     case 1:
     console.log('Creates an object store');
     upgradeDB.createObjectStore('restaurants', {keyPath: 'id'});

     case 2:
     console.log('Creates a review object store');
     upgradeDB.createObjectStore('reviews', {keyPath: 'id'});

     case 3:
     console.log('Create a restaurant id index');
     var store = upgradeDB.transaction.objectStore('reviews');
     store.createIndex('restaurant', 'restaurant_id');

   } //Closes switch statement
 }); //End of idb.open function
})(); //End of idbApp function


class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337;
    return `http://localhost:${port}/restaurants`;
  }
  /**
   * Fetch all restaurants.
   */
      static getRestaurantsFromIDB(callback) {
        fetch(DBHelper.DATABASE_URL) //grabs data from http://localhost:1337/restaurants
        .then(response => response.json()) //reads and parses data using json()
        //.then(response => console.log(response.json())) //successfully grabbing data
        .then(restaurants => //promise where we indicate what to do with the data
          {
            dbPromise.then(db => {
              const tx = db.transaction('restaurants', 'readwrite'); //create a transaction
              const store = tx.objectStore('restaurants'); //store objectStore
              restaurants.forEach(restaurant => {  //loop through the data
                store.put(restaurant); //add data to db
              });
               return tx.complete; //verifies transaction successfully completed
            });
            //Callback functions allow functions to use other functions within parameters
            //So they can be executed after the current function has finished
            callback(null, restaurants);
          })
        .catch(error => {//handles error messages
        const errorMessage = (`Request FAILED. Returned status of ${error.statusText}`);
        callback(errorMessage, null);
      });
    }//End of fetch function


    //Grabs restaurants from IndexedDB when offline
    static fetchRestaurants(callback){
      console.log("You have reached IndexedDB");
      dbPromise.then(db => {
        const tx = db.transaction('restaurants');
        const store = tx.objectStore('restaurants');
        console.log(store);
        return store.getAll();
      });
        DBHelper.getRestaurantsFromIDB(restaurants);
        callback(null, restaurants);
    }


  //Fetch all reviews
  static fetchRestaurantReviews(id, callback) {
     fetch(`http://localhost:1337/reviews/?restaurant_id=${id}`)
    .then(response => response.json())
    .then(reviews =>
      {
        dbPromise.then(db => {
          const tx = db.transaction('reviews', 'readwrite');
          const store = tx.objectStore('reviews');
          reviews.forEach(review => {
            store.put(review);
          });
          return tx.complete;
        });
        callback(null, reviews);
      })
      //Load reviews from IDB when offline
      .catch(error => {
        return DBHelper.getReviewsFromIDB('reviews', 'restaurant_id', id);
        /*.then(storedReviews => {
          Promise.resolve(storedReviews);
          console.log(`Promise resolve results: ${storedReviews}`);
        })*/
    });
  }//End of fetched reviews


  //Grabs reviews from IndexedDB when offline
  static getReviewsFromIDB(objectstore, idx, restID) {
    //console.log(`from IDB: ${objectstore} + ${idx} + ${restID}`);
     dbPromise.then(db => {
      const tx = db.transaction(objectstore);
      const store = tx.objectStore(objectstore);
      const restIndex = store.index(idx);
      return restIndex.getAll(restID);
    });
  }//End of getReviewsFromIDB


  //Adds submitted reviews to DB
  static addReview(id, name, rating, comments) {

    //Check if the user is online or offline
    let offlineReviewObj = {
      name: 'reviews',
      data: {
        'restaurant_id': parseInt(id),
        'name': name,
        'rating': parseInt(rating),
        'comments': comments,
        'createdAt': Date.now()
      },
      object_type: 'offline_reviews'
    };

    if(!navigator.onLine && (offlineReviewObj.name === 'reviews')) {
      DBHelper.reviewSentWhenOnline(offlineReviewObj);
      return;
    }

      let body = {
        'restaurant_id': parseInt(id),
        'name': name,
        'rating': parseInt(rating),
        'comments': comments,
        'createdAt': Date.now()
      };

    fetch(`http://localhost:1337/reviews/`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers ({
        'Content-Type': 'application/json'
      })
    })
    .then(response => response.json())
    //.then(response => console.log(response.json())) //successfully grabbing data

}//End of fetch function


  //Method to handle offline review submissions
  static reviewSentWhenOnline(offlineReviewObj) {
    //Adding review to localstorage
    localStorage.setItem('data', JSON.stringify(offlineReviewObj.data));
    //Check if online
    window.addEventListener('online', (event) => {
      let reviewData = JSON.parse(localStorage.getItem('data'));

      //Add review data to DB
      if(reviewData !== null) {
        if(offlineReviewObj.name === 'reviews') {
          let id = offlineReviewObj.data.restaurant_id;
          let name = offlineReviewObj.data.name;
          let rating = offlineReviewObj.data.rating;
          let comments = offlineReviewObj.data.comments;

          DBHelper.addReview(id, name, rating, comments);
        }
        //Once data is sent, erase from local storage
        localStorage.removeItem('reviewData');
      }
    });
  }// End of reviewsSentWhenOnline


  //Fetch FAVORITE status
  static updateRestaurantFavorite(restaurantID, isFavorite) {
    //console.log('RestaurantId: ' + restaurantID, 'Favorite: ' + isFavorite);
    fetch(DBHelper.DATABASE_URL + `/${restaurantID}/?is_favorite=${isFavorite}`, {
      method: 'PUT'
    })
    //.then(response => response.json())
    .then(restaurants =>
      {
        dbPromise.then(db => {
          const tx = db.transaction('restaurants', 'readwrite');
          const store = tx.objectStore('restaurants');
          store.get(restaurantID)
          .then(restaurant => {
            restaurant.is_favorite = isFavorite; //changes favorite status
            store.put(restaurant);
          });
        })
      })
}//End of updateRestaurantFavorite function


  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
  // fetch all restaurants with proper error handling.
  DBHelper.fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      const restaurant = restaurants.find(r => r.id == id);
      if (restaurant) { // Got the restaurant
        callback(null, restaurant);
      } else { // Restaurant does not exist in the database
        callback('Restaurant does not exist', null);
      }
    }
  });
}


  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }


  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }


  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }


  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }


  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }


  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }


  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    //return `(/img/${restaurant.id}`);
    if(restaurant.photograph) {
      return `/img/${restaurant.photograph}.jpg`;
    }
    return (`/img/${restaurant.id}.jpg`);
  }


  /**
  * Restaurant image alt url
  */
  static imageAltForRestaurant(restaurant) {
    return (`${restaurant.name}`);
  }


  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

} //End of DBHelper class
