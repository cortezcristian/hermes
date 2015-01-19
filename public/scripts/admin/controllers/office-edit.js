'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:OfficeEditCtrl
 * @description
 * # OfficeEditCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('OfficeEditCtrl', function ($scope, $location, Restangular, office) {
  var original = office;
  $scope.office = Restangular.copy(original);
  

  $scope.isClean = function() {
    return angular.equals(original, $scope.office);
  }

  $scope.destroy = function() {
    original.remove().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/office";
      } else {
        $location.path('/crud/office');
      }
    });
  };

  $scope.save = function() {
    $scope.office.put().then(function() {
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/office";
      } else {
        $location.path('/crud/office');
      }
    });
  };
});
