'use strict';

$(document).ready(function(){

});

var notificationsInterval

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
      controller: function($scope, $location, PeopleService, $interval) {
        $scope.notifications = [];
        $scope.refreshNotifications = function (){
           PeopleService.getNotifications().then(function(r){
                $scope.notifications = r.data;
           });
        }
        
        if(typeof notificationsInterval !== 'undefined') {
            //Cancel it
            $interval.cancel(notificationsInterval);
        }

        $scope.refreshNotifications();
        
        notificationsInterval = $interval(function(){
            $scope.refreshNotifications();
        }, 1000);

      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
