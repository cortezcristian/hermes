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
      controller: function($scope, $location, PeopleService, $window, $timeout) {
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
        
        $scope.checkTarget = function (e) {
            if(!e.target.outerHTML.match(/.*d-item-title.*/)
                && !e.target.outerHTML.match(/.*img.*/)){
                e.preventDefault();
            }
        }

        $scope.removeOpentab = function (id){
           PeopleService.removeOpenTab(id).then(function(r){
                $scope.refreshOpentabs();
                
                //if($location.path().match(/.*chatuser.*/)) {
                if($location.path().match(new RegExp(".*chatuser.*"+r.data.tabid+".*","i"))) {
                // add set timeout 100
                $timeout(function(){
                    $window.history.back();
                }, 100);
                }
           });
        }

        $scope.refreshOpentabs();

      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
