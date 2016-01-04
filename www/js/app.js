// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

// Develop only. CORS related
.constant('DevelopApi', {
  url: 'http://localhost:8100/variables.html'
})

// Filter for timestamps to seconds
.filter('timestampToSeconds', function() {
  return function(input) {
    numbers = input.match(/\d+/g);
    seconds = 0;
    seconds += parseInt(numbers[2]);
    seconds += (60 * parseInt(numbers[1]));
    seconds += (60 * 60 * parseInt(numbers[0]));
    return seconds
  };
})
// Filter for seconds to timestamp
.filter('secondsToTimestamp', function() {
  return function(input) {
    hours = Math.floor(input / (60 * 60));
    time2 = input % (60 * 60);
    minutes = Math.floor(time2 / 60);
    seconds = time2 % 60;
    return hours + ":" + minutes + ":" + seconds;
  };
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.controls', {
    url: '/controls',
    views: {
      'tab-controls': {
        templateUrl: 'templates/tab-controls.html',
        controller: 'ControlsCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/controls');
});
