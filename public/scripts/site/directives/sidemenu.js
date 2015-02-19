'use strict';

$(document).ready(function(){

});

/**
 * @ngdoc directive
 * @name anyandgoApp.directive:sidemenu
 * @description
 * # sidemenu
 */
angular.module('anyandgoApp')
  .directive('sidemenu', function ($location) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
           // http://stackoverflow.com/a/22282124/467034
           function setActive() {
                var path = $location.path();
                if (path) {
                    angular.forEach(element.find('li'), function (li) {
                        var anchor = li.querySelector('a');
                        if (anchor.href.match('#' + path + '(?=\\?|$)')) {
                            angular.element(li).addClass('active');
                        } else {
                            angular.element(li).removeClass('active');
                        }
                    });
                }
            }

            setActive();

            scope.$on('$locationChangeSuccess', setActive);
      }
    };
  });
