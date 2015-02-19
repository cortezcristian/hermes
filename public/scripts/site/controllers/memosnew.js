'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemosNewCtrl
 * @description
 * # MemosNewCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemosNewCtrl', function ($scope, $routeParams, PeopleService, $interval) {
      
      if(typeof chatInterval !== 'undefined') {
        //Cancel it
        $interval.cancel(chatInterval);
      }

  });
