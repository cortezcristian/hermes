'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MainCtrl
 * @description
 * # ChatService
 * Service of the anyandgoApp
 */
angular.module('anyandgoApp')
  .factory('ChatService', function ($http) {
     var req = function(method, path, data){
        return $http({
            method: method,
            url: '.'+path,
            data: data
//        }).then(function(res){
//            return res.data;
        });
     }
     
     return {
         get: function(path, data){
             return req('GET', path, data);
         },
         post: function(path, data){
             return req('POST', path, data);
         },
         put: function(path, data){
             return req('PUT', path, data);
         },
         delete: function(path, data){
             return req('DELETE', path, data);
         },
         getUserInfo: function(iduser){
             iduser = (iduser !== '') ? iduser : 'me';
             return req('GET', '/services/ask/user/info/'+iduser);
         },
         updateChatHistory: function(iduserto, hashfrom){
             hashfrom = (hashfrom !== '') ? hashfrom : 'none';
             return req('GET', '/services/ask/private/chat/'+iduserto+'/updates/'+hashfrom);
         },
         getChatHistory: function(iduserto, period){
             var p = period || 'day';
             return req('GET', '/services/ask/private/chat/'+iduserto+'/history/'+p);
         },
         sendChat: function(userto, msg){
             return req('POST', '/services/send/private/chat/', {
                 userto: userto,
                 msg: msg
             });
         }
     }; 
  });
