'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemoRecordEditCtrl
 * @description
 * # MemoRecordEditCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemoRecordEditCtrl', function ($scope, $location, Restangular, memorecord) {
  var original = memorecord;
  $scope.memorecord = Restangular.copy(original);
  

  $scope.isClean = function() {
    return angular.equals(original, $scope.memorecord);
  }

  $scope.destroy = function() {
    original.remove().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/memorecord";
      } else {
        $location.path('/crud/memorecord');
      }
    });
  };

  $scope.save = function() {
    $scope.memorecord.put().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/memorecord";
      } else {
        $location.path('/crud/memorecord');
      }
    });
  };
});
