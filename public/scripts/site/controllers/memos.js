'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemosCtrl
 * @description
 * # MemosCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemosCtrl', function ($scope, $routeParams, PeopleService, $interval) {
      
      if(typeof chatInterval !== 'undefined') {
        //Cancel it
        $interval.cancel(chatInterval);
      }

  });
