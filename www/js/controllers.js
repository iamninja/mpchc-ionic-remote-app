angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, DevelopApi, Settings) {
  // Settings
  settings = Settings.settings;
  ipAddress = settings.ipAddress;
  port = settings.port;
  // For development only
  // baseUrl = DevelopApi.url;
  baseUrl = 'http://' + ipAddress + ':' + port;
  urlCommand = baseUrl + '/command.html';
  urlVariables = baseUrl + '/variables.html';

  console.log(baseUrl);

  $scope.data = {
    volume: 0,
  };

  // Get volume level on controllers load
  getVolumeLevel = function() {
    $http({
      method: 'POST',
      url: urlVariables,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(function successCallback(response) {
      parser = new DOMParser();
      doc = parser.parseFromString(response.data, 'text/html');
      volumeLevel = doc.querySelectorAll('#volumelevel')[0].textContent;
      console.log('Start level: ' + volumeLevel);
      $scope.data.volume = parseInt(volumeLevel);
      return parseInt(volumeLevel);
    }, function erroCallback(response){
      console.log(response);
    });
  };
  volumeLevel = getVolumeLevel();


  // Execute POST commands
  $scope.sendCommand = function(command, extra, extraValue) {
    extra       = typeof extra !== 'undefined' ? extra : 'null';
    extraValue  = typeof extraValue !== 'undefined' ? extraValue : '0';

    data = {
      'wm_command': command,
    };

    $http({
      method: 'POST',
      url: urlCommand,
      data: 'wm_command=' + command + '&' + extra + '=' + extraValue,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };

  // Volume control
  $scope.increaseVolume = function(value) {
    if (($scope.data.volume + value) > 100) {
      return;
    };
    $scope.data.volume = $scope.data.volume + value;
    $scope.updateVolume($scope.data.volume);
    console.log($scope.data.volume);
  };
  $scope.decreaseVolume = function(value) {
    if (($scope.data.volume - value) < 0) {
      return;
    };
    $scope.data.volume = $scope.data.volume - value;
    $scope.updateVolume($scope.data.volume);
    console.log($scope.data.volume);
  };
  $scope.updateVolume = function(volume) {
    $scope.data.volume = parseInt(volume);
    $http({
      method: 'POST',
      url: urlCommand,
      data: 'wm_command=' + '-2' + '&' + 'volume' + '=' + volume,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    console.log(volume);
    console.log($scope.data.volume);
  };

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $localstorage, Settings) {
  $scope.settings = Settings.settings;
  $localstorage.setObject('settings', $scope.settings);
});
