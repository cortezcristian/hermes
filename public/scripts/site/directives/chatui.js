'use strict';

$(document).ready(function(){

    console.log("Starting...");
    $('.chat-msg-container, #side-chat-menu').css('overflow','hidden');
    $('.chat-msg-container, #side-chat-menu').perfectScrollbar();
    
});

/**
 * @ngdoc directive
 * @name anyandgoApp.directive:chatui
 * @description
 * # chatui
 */
angular.module('anyandgoApp')
  .directive('chatui', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
