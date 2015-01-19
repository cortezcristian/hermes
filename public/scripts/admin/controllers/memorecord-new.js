'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemoRecordNewCtrl
 * @description
 * # MemoRecordNewCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemoRecordNewCtrl', function ($scope, $location, Restangular) {
  $scope.save = function() {
    Restangular.all('memorecords').post($scope.memorecord).then(function(memorecord) {  
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/memorecord";
      } else {
        $location.path('/crud/memorecord');
      }
    });
  }
});
