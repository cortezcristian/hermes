'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:OfficeNewCtrl
 * @description
 * # OfficeNewCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('OfficeNewCtrl', function ($scope, $location, Restangular) {
  $scope.save = function() {
    Restangular.all('offices').post($scope.office).then(function(office) {  
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/office";
      } else {
        $location.path('/crud/office');
      }
    });
  }
});
