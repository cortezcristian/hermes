'use strict';

$(document).ready(function(){


    // http://stackoverflow.com/questions/18168505/how-to-load-json-data-from-an-ajax-call-in-angularjs-bootstrap-modal

    $('#exampleModal').on('show.bs.modal', function (e) {
        //e.preventDefault();
        //e.stopPropagation();
        var button = $(event.target).parent();
        var recipient = button.data('id');

        var modal = $(this);
        //modal.find('.modal-title').text('New message to ' + recipient)
        modal.find('.modal-body input').val(recipient)
    });

    /*
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
      templateUrl: '/scripts/site/views/profilemod.html',
      controller: function($scope, $location, PeopleService) {
        $scope.iProfile = {};
        $scope.inspectProfile = function (id){
           PeopleService.getProfile(id).then(function(r){
                $scope.iProfile = (typeof r.data._id !== "undefined") ? r.data : {};    
           });
        }
        $scope.startChat = function(id){
            $location.path('/chatuser/'+id)
            $('#exampleModal').modal('hide');
            $scope.$apply();
        };
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
