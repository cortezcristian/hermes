'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemosCtrl
 * @description
 * # MemosCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemosCtrl', function ($scope, $routeParams, PeopleService, $interval) {
      
      if(typeof chatInterval !== 'undefined') {
        //Cancel it
        $interval.cancel(chatInterval);
      }
      
      $scope.memosinbox = [];
      $scope.memosoutbox = [];
      $scope.memoread = "";
      $scope.ownmemoread = "";
      $scope.activesection = "inbox";
      
      // Get all memos
      PeopleService.getMemosInbox().then(function(r){
          $scope.memosinbox = r.data;
      });
      
      $scope.getMemo = function(id){
          // Get memo
          PeopleService.getMemo(id).then(function(r){
              $scope.memoread = r.data;
          });
      };
      
      $scope.getOwnMemo = function(id){
          // Get own memo
          PeopleService.getMemo(id).then(function(r){
              $scope.ownmemoread = r.data;
          });
      };
      
      $scope.setSection = function(name){
          $scope.activesection = name;
          if(name === 'outbox'){
              PeopleService.getMemosOutbox().then(function(r){
                  $scope.memosoutbox = r.data;
              });
          }else{
              PeopleService.getMemosInbox().then(function(r){
                  $scope.memosinbox = r.data;
              });
          }
      }

  });
