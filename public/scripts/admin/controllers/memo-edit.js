'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemoEditCtrl
 * @description
 * # MemoEditCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemoEditCtrl', function ($scope, $location, Restangular, memo) {
  var original = memo;
  $scope.memo = Restangular.copy(original);
  

  $scope.isClean = function() {
    return angular.equals(original, $scope.memo);
  }

  $scope.destroy = function() {
    original.remove().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/memo";
      } else {
        $location.path('/crud/memo');
      }
    });
  };

  $scope.save = function() {
    $scope.memo.put().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/memo";
      } else {
        $location.path('/crud/memo');
      }
    });
  };
});
