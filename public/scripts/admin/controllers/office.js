'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:OfficeCtrl
 * @description
 * # OfficeCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('OfficeCtrl', function ($scope, Restangular) {
   $scope.offices = Restangular.all("offices").getList().$object;
  });
