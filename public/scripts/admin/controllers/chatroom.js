'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:ChatRoomCtrl
 * @description
 * # ChatRoomCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('ChatRoomCtrl', function ($scope, Restangular) {
   $scope.chatrooms = Restangular.all("chatrooms").getList().$object;
  });
