'use strict';

$(document).ready(function(){

});

/**
 * @ngdoc directive
 * @name anyandgoApp.directive:notificationsmod
 * @description
 * # notificationsmod
 */
angular.module('anyandgoApp')
  .directive('notificationsmod', function () {
    return {
      restrict: 'A',
      templateUrl: '/scripts/site/views/notificationsmod.html',
      controller: function($scope, $location, PeopleService) {
        $scope.notifications = [];
        $scope.refreshNotifications = function (){
           PeopleService.getNotifications().then(function(r){
                $scope.notifications = r.data;
           });
        }

        $scope.refreshNotifications();

      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
