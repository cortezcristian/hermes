'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MainCtrl', function ($scope, ChatService) {
    $scope.chatmsg = '';
    $scope.anyandgoversion = 'v0.1';
    $scope.sendPrivateChat = function(){
        console.log($scope.chatmsg);    
        ChatService.sendChat('userto', $scope.chatmsg);
    };
  });
