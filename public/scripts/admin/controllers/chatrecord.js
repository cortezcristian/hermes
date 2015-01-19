'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:ChatRecordCtrl
 * @description
 * # ChatRecordCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('ChatRecordCtrl', function ($scope, Restangular) {
   $scope.chatrecords = Restangular.all("chatrecords").getList().$object;
  });
