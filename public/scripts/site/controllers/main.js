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
    $scope.messages = [];
    $scope.chatmsg = '';
    $scope.anyandgoversion = 'v0.1';

    $scope.userto = $routeParams.userto || '';

    $scope.setChatRoomUser = function($event){
        $event.preventDefault();
        console.log($event);
        // $scope.userto = 
        // message
    };

    //https://github.com/lifeentity/chat-app/blob/master/public/app/scripts/controllers/chat-room.js
    var clearTextarea = function(r){
        console.log("aaaa");
        $scope.chatmsg = "";
        return r;
    };

    var reloadMessages = function(r){
        $scope.messages = r.data.history;
        return r;
    };

    $scope.sendPrivateChat = function(){
        //console.log($scope.chatmsg);    
        if($scope.userto !== "") {
            ChatService.sendChat($scope.userto, $scope.chatmsg)
                .then(clearTextarea);
        }
    };

    if($scope.userto !== "") {
        ChatService.getChatHistory($scope.userto, 'day')
            .then(reloadMessages);
    }
  });
