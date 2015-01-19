'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemoRecordCtrl
 * @description
 * # MemoRecordCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemoRecordCtrl', function ($scope, Restangular) {
   $scope.memorecords = Restangular.all("memorecords").getList().$object;
  });
