'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:SectorEditCtrl
 * @description
 * # SectorEditCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('SectorEditCtrl', function ($scope, $location, Restangular, sector) {
  var original = sector;
  $scope.sector = Restangular.copy(original);
  

  $scope.isClean = function() {
    return angular.equals(original, $scope.sector);
  }

  $scope.destroy = function() {
    original.remove().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/sector";
      } else {
        $location.path('/crud/sector');
      }
    });
  };

  $scope.save = function() {
    $scope.sector.put().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/sector";
      } else {
        $location.path('/crud/sector');
      }
    });
  };
});
