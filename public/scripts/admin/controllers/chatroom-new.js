'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:ChatRoomNewCtrl
 * @description
 * # ChatRoomNewCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('ChatRoomNewCtrl', function ($scope, $location, Restangular) {
  $scope.save = function() {
    Restangular.all('chatrooms').post($scope.chatroom).then(function(chatroom) {  
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/chatroom";
      } else {
        $location.path('/crud/chatroom');
      }
    });
  }
});
