//Service worker registration

if('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      //Woot woot Go registration
      console.log('Yay, serviceWorker registration successful', registration);

    }, function(err) {
      //Oh no...failed!
      console.log('serviceWorker registration failed: ', err);
    });
  });
}
