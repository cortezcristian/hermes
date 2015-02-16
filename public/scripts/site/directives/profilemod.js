'use strict';

$(document).ready(function(){

    /*
    $('#exampleModal').on('show.bs.modal', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $(document).on('click', '.btn-prevented', function(e){
        //debugger;
        e.preventDefault();
        e.stopPropagation();
    });
    */
    
});

/**
 * @ngdoc directive
 * @name anyandgoApp.directive:profilemod
 * @description
 * # profilemod
 */
angular.module('anyandgoApp')
  .directive('profilemod', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
