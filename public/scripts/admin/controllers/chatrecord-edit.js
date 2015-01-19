'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:ChatRecordEditCtrl
 * @description
 * # ChatRecordEditCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('ChatRecordEditCtrl', function ($scope, $location, Restangular, chatrecord) {
  var original = chatrecord;
  $scope.chatrecord = Restangular.copy(original);
  

  $scope.isClean = function() {
    return angular.equals(original, $scope.chatrecord);
  }

  $scope.destroy = function() {
    original.remove().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/chatrecord";
      } else {
        $location.path('/crud/chatrecord');
      }
    });
  };

  $scope.save = function() {
    $scope.chatrecord.put().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/chatrecord";
      } else {
        $location.path('/crud/chatrecord');
      }
    });
  };
});
