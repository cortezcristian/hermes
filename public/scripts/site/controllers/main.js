'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MainCtrl', function ($scope, $routeParams, ChatService) {
    $scope.chatmsg = '';
    $scope.anyandgoversion = 'v0.1';

    $scope.userto = $routeParams.userto || '';

    $scope.setChatRoomUser = function($event){
        $event.preventDefault();
        console.log($event);
        // $scope.userto = 
        // message
    };

    $scope.sendPrivateChat = function(){
        //console.log($scope.chatmsg);    
        ChatService.sendChat($scope.userto, $scope.chatmsg).then(function(r){
            console.log(r);
            $scope.chatmsg = "";    
            return r;
            //https://github.com/lifeentity/chat-app/blob/master/public/app/scripts/controllers/chat-room.js
        });
    };
  });
