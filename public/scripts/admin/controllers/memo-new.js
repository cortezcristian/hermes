'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemoNewCtrl
 * @description
 * # MemoNewCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemoNewCtrl', function ($scope, $location, Restangular) {
  $scope.save = function() {
    Restangular.all('memos').post($scope.memo).then(function(memo) {  
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/memo";
      } else {
        $location.path('/crud/memo');
      }
    });
  }
});
