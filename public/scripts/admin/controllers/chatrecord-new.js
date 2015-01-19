'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:ChatRecordNewCtrl
 * @description
 * # ChatRecordNewCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('ChatRecordNewCtrl', function ($scope, $location, Restangular) {
  $scope.save = function() {
    Restangular.all('chatrecords').post($scope.chatrecord).then(function(chatrecord) {  
      if(navigator.userAgent.match(/Zombie/)) {
          document.location.hash = "#/crud/chatrecord";
      } else {
        $location.path('/crud/chatrecord');
      }
    });
  }
});
