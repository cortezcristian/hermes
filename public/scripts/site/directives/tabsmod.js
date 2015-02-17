'use strict';

$(document).ready(function(){

});

/**
 * @ngdoc directive
 * @name anyandgoApp.directive:tabsmod
 * @description
 * # tabsmod
 */
angular.module('anyandgoApp')
  .directive('tabsmod', function () {
    return {
      restrict: 'A',
      templateUrl: '/scripts/site/views/tabsmod.html',
      controller: function($scope, $location, PeopleService) {
        $scope.opentabs = [];
        $scope.refreshOpentabs = function (){
           PeopleService.getOpenTabs().then(function(r){
                $scope.opentabs = r.data;
           });
        }

        $scope.saveOpentab = function (id){
           PeopleService.saveOpenTab(id).then(function(r){
                $scope.refreshOpentabs();
           });
        }

        $scope.removeOpentab = function (id){
           PeopleService.removeOpenTab(id).then(function(r){
                $scope.refreshOpentabs();
           });
        }

        $scope.refreshOpentabs();

      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
