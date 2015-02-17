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
         getOffices: function(val){
             return req('GET', '/services/offices/'+val);
         },
         getSectors: function(val){
             return req('GET', '/services/sectors/'+val);
         },
         getProfile: function(val){
             return req('GET', '/services/profile/'+val);
         },
         getAllPeople: function(){
             return req('POST', '/services/people/all', {
                 userto: userto,
                 msg: msg
             });
         }
     }; 
  });
