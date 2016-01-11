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

.factory('PlayingData', function(){
  return {
    data: {
      volume: 0,
      positionString: "",
      titleAndEpisode: {},
    },
  };
})

.factory('HummingbirdAPI', function($http, PlayingData){
  return {
    searchAnimeByName: function() {
      humUrl = 'http://hummingbird.me/api/v1';
      searchAnimeUrl = '/search/anime';
      $http({
        method: 'GET',
        url: humUrl + searchAnimeUrl + '?query=' + PlayingData.data.titleAndEpisode.title,
      })
      .then(function success(response) {
        PlayingData.meta = response.data[0];
      }, function failure(response) {
        console.log(response);
      });
    }
  };
})

.factory('GetDetails', function($http, PlayingData, Settings){
  // data = PlayingData.data;

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
    },

    data: {

    },

    getVariables: function() {
      $http({
      method: 'POST',
      url: 'http://' + Settings.settings.ipAddress + ':' + Settings.settings.port + '/variables.html',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      })
      .then(function successCallback(response) {
        parser = new DOMParser();
        doc = parser.parseFromString(response.data, 'text/html');
        volumeLevel = doc.querySelectorAll('#volumelevel')[0].textContent;
        timeString = doc.querySelectorAll('#positionstring')[0].textContent;
        file = doc.querySelectorAll('#file')[0].textContent;
        console.log(timeString);
        console.log('Start level: ' + volumeLevel);
        $scope.data.volume = parseInt(volumeLevel);
        data.volume = parseInt(volumeLevel);
        $scope.data.positionString = timeString;
        data.positionString = timeString;
        $scope.data.titleAndEpisode = GetDetails.titleAndEpisode(file);
        data.titleAndEpisode = GetDetails.titleAndEpisode(file);
        // console.log($scope.data);
        PlayingData.data = $scope.data;
        self.data.titleAndEpisode = data.titleAndEpisode;
      }, function erroCallback(response){
        console.log(response);
      });
    }
  }
})

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
