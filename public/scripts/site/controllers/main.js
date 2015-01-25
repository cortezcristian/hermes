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
    $scope.lastmsghash = '';
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
        if(r.data.history.length > 0){
            $scope.lastmsghash = r.data.history[r.data.history.length-1]._id;
        }
        return r;
    };

    var updateMessages = function(r){
        return ChatService.updateChatHistory($scope.userto, $scope.lastmsghash);
    };

    var showUpdateMessages = function(r){
        if($scope.userto !== "" && $scope.lastmsghash !== "") {
            $scope.messages = $scope.messages.concat(r.data.history);
            $scope.lastmsghash = r.data.history[r.data.history.length-1]._id;
        }
        return r;
    };

    $scope.sendPrivateChat = function(){
        //console.log($scope.chatmsg);    
        if($scope.userto !== "") {
            ChatService.sendChat($scope.userto, $scope.chatmsg)
                .then(clearTextarea)
                .then(updateMessages)
                .then(showUpdateMessages);
        }
    };

    if($scope.userto !== "") {
        ChatService.getChatHistory($scope.userto, 'day')
            .then(reloadMessages);
    }

  });
