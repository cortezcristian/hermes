'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:SectorCtrl
 * @description
 * # SectorCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('SectorCtrl', function ($scope, Restangular) {
   $scope.sectors = Restangular.all("sectors").getList().$object;
  });
