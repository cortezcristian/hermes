'use strict';
var chatInterval;


/**
 * @ngdoc function
 * @name anyandgoApp.controller:PeopleCtrl
 * @description
 * # PeopleCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('PeopleCtrl', function ($scope, $routeParams, PeopleService) {
      $scope.searchvalue = "";    
      $scope.people = [];

      $scope.searchPeople = function(text){
          if( text !== '' ){
              PeopleService.searchPeople(text).then(function(r){
                  $scope.people = r.data;
                  //$scope.searchvalue = "";    

                  return r; 
              });
          } 
      } 

      $scope.$watch('searchvalue', function(){
         $scope.searchPeople($scope.searchvalue);
      });


  });
