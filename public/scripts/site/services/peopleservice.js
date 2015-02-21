'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MainCtrl
 * @description
 * # PeopleService
 * Service of the anyandgoApp
 */
angular.module('anyandgoApp')
  .factory('PeopleService', function ($http) {
     var req = function(method, path, data){
        return $http({
            method: method,
            url: '.'+path,
            data: data
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
         searchPeople: function(val, office, sector){
             val = (typeof val === 'undefined' || val === '' ) ? ' ' : val;
             office = (typeof office === 'undefined' || office === '' ) ? 'all' : office;
             sector = (typeof sector === 'undefined' || sector === '' ) ? 'all' : sector;
             return req('GET', '/services/search/people/'+val+'/office/'+office+'/sector/'+sector);
         },
         getNotifications: function(val){
             val = (typeof val === 'undefined' || val === '' ) ? 'all' : val;
             return req('GET', '/services/unread/notifiactions/'+val);
         },
         getOffices: function(val){
             return req('GET', '/services/offices/'+val);
         },
         getSectors: function(val){
             return req('GET', '/services/sectors/'+val);
         },
         getProfile: function(val){
             return req('GET', '/services/profile/'+val);
         },
         getOpenTabs: function(val){
             return req('GET', '/services/open/tabs/');
         },
         saveOpenTab: function(userto){
             return req('POST', '/services/save/chat/tab', {
                 userto: userto
             });
         },
         removeOpenTab: function(userto){
             return req('POST', '/services/remove/chat/tab', {
                 userto: userto
             });
         },
         sendMemo: function(users, memocontent){
             return req('POST', '/services/send/memo', {
                 usersto: users,
                 memobody: memocontent
             });
         },
         getAllPeople: function(){
             return req('POST', '/services/people/all', {
                 userto: userto,
                 msg: msg
             });
         }
     }; 
  });
