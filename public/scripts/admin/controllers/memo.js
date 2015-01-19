'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemoCtrl
 * @description
 * # MemoCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemoCtrl', function ($scope, Restangular) {
   $scope.memos = Restangular.all("memos").getList().$object;
  });
