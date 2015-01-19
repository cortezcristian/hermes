'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:SectorNewCtrl
 * @description
 * # SectorNewCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('SectorNewCtrl', function ($scope, $location, Restangular) {
  $scope.save = function() {
    Restangular.all('sectors').post($scope.sector).then(function(sector) {  
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/sector";
      } else {
        $location.path('/crud/sector');
      }
    });
  }
});
