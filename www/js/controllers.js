angular.module('starter.controllers', [])

.controller('ControlsCtrl', function($scope, $http, DevelopApi, Settings, $localstorage, $filter) {
  // Settings
  if (typeof $localstorage.get('settings') !== 'undefined') {
    console.log($localstorage.get('settings'));
    Settings.settings = $localstorage.getObject('settings');
  };
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
    positionString: "",
  };

  // Get variables
  getVariables = function() {
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
      timeString = doc.querySelectorAll('#positionstring')[0].textContent;
      console.log(timeString);
      console.log('Start level: ' + volumeLevel);
      $scope.data.volume = parseInt(volumeLevel);
      $scope.data.positionString = timeString;
    }, function erroCallback(response){
      console.log(response);
    });
  };

  getVariables();

  volumeLevel = $scope.data.volume;


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

  // Smart Skip
  $scope.smartSkip = function() {
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
      timeString = doc.querySelectorAll('#positionstring')[0].textContent;
      console.log(timeString);
      secondsString = $filter('timestampToSeconds')(timeString);
      newSecondsTime = parseInt(secondsString) + parseInt(Settings.settings.smartSkip);
      newStringTime = $filter('secondsToTimestamp')(newSecondsTime);
      $scope.sendCommand('-1', 'position', newStringTime);
    }, function erroCallback(response){
      console.log(response);
    });
  };
})

.controller('SettingsCtrl', function($scope, $localstorage, Settings) {
  if (typeof $localstorage.get('settings') !== 'undefined'){
    Settings.settings = $localstorage.getObject('settings');
  };
  $scope.settings = Settings.settings;
  $scope.saveChanges = function(settings) {
    $localstorage.setObject('settings', settings);
    Settings.settings = settings;
    console.log(settings);
  };
});
