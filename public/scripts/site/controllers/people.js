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
      $scope.selectedSector = {_id: "all"};    
      $scope.selectedOffice = {_id: "all"};    
      $scope.people = [];
      $scope.sectors = [{name: "Todos", _id:"all"}];
      $scope.offices = [{name: "Todas", _id:"all"}];


      // Get all offices

      PeopleService.getOffices('all').then(function(r){
          $scope.offices = $scope.offices.concat(r.data);
      });

      PeopleService.getSectors('all').then(function(r){
          $scope.sectors = $scope.sectors.concat(r.data);
      });

      $scope.searchPeople = function(text){
          if( text !== '' ){
              PeopleService.searchPeople(text, $scope.selectedOffice._id, $scope.selectedSector._id).then(function(r){
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
