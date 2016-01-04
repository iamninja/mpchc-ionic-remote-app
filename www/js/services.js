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
}])

.factory('GetVariables', ['$http', function($http, $q){
  return {
    all: function(callback){
      $http({
          method: 'POST',
          url: urlVariables,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .success(function successCallback(response) {
          parser = new DOMParser();
          doc = parser.parseFromString(response.data, 'text/html');
          volumeLevel = doc.querySelectorAll('#volumelevel')[0].textContent;
          timeString = doc.querySelectorAll('#positionstring')[0].textContent;
          data = {
            volume: volumeLevel,
            positionString: timeString
          };
          callback;
          // console.log(timeString);
          // console.log('Start level: ' + volumeLevel);
          // $scope.data.volume = parseInt(volumeLevel);
          // $scope.data.positionString = timeString;

        })
        .error(function(error) {
           callback;
        });
    }
  };
}])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
