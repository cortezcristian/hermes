'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:ChatRoomEditCtrl
 * @description
 * # ChatRoomEditCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('ChatRoomEditCtrl', function ($scope, $location, Restangular, chatroom) {
  var original = chatroom;
  $scope.chatroom = Restangular.copy(original);
  

  $scope.isClean = function() {
    return angular.equals(original, $scope.chatroom);
  }

  $scope.destroy = function() {
    original.remove().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/chatroom";
      } else {
        $location.path('/crud/chatroom');
      }
    });
  };

  $scope.save = function() {
    $scope.chatroom.put().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/chatroom";
      } else {
        $location.path('/crud/chatroom');
      }
    });
  };
});
