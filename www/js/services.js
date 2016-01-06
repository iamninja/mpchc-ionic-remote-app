angular.module('starter.services', [])

.factory('Settings', function(){
  return {
    settings: {
      ipAddress: '',
      port: 13579,
      smartSkip: 90,
    }
  };
})

.factory('GetDetails', ['$http', function($http){
  return {
    titleAndEpisode: function(filename) {
      // Remove parentheses and square brackets
      filename = filename.replace(/(\[.*?\]|\(.*?\)) */g, "");
      // Remove extension if exists
      titleAndEpisode = filename.substr(0, filename.lastIndexOf('.')) || filename;
      // Replace "-" with spaces and trim
      titleAndEpisode = titleAndEpisode.replace(/_/g, " ").trim();
      // Get title
      title = titleAndEpisode.substr(0, titleAndEpisode.lastIndexOf('-')).trim() || titleAndEpisode;
      // Get episode
      episode = titleAndEpisode.substr(titleAndEpisode.lastIndexOf('-') + 1, titleAndEpisode.length).trim() || "";

      return {
        title: title,
        episode: episode,
      };
    }
  }
}])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
