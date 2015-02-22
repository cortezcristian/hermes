'use strict';

$(document).ready(function(){
    $('a.collapser').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        $("#user-panel").toggleClass('do-collapse');
        if($("#user-panel").hasClass('do-collapse')){
            $("#side").width('40px');
            $("#content").width(($(window).width()-40)+'px');
        } else {
            $("#side").width('');
            $("#content").width('');
        }
    });
});

/**
 * @ngdoc overview
 * @name anyandgoApp
 * @description
 * # anyandgoApp
 *
 * Main module of the application.
 */
angular
  .module('anyandgoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ckeditor',
    'restangular'
  ])
  .config(function ($routeProvider, $locationProvider, RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/scripts/site/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/chatuser/:userto', {
        templateUrl: '/scripts/site/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/people', {
        templateUrl: '/scripts/site/views/people.html',
        controller: 'PeopleCtrl'
      })
      .when('/memos', {
        templateUrl: '/scripts/site/views/memos.html',
        controller: 'MemosCtrl'
      })
      .when('/memos/new', {
        templateUrl: '/scripts/site/views/memosnew.html',
        controller: 'MemosNewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function ($rootScope, $location,$route, $timeout) {

    $rootScope.config = {};
    $rootScope.config.app_url = $location.url();
    $rootScope.config.app_path = $location.path();
    $rootScope.layout = {};
    $rootScope.layout.loading = false;

    $rootScope.$on('$routeChangeStart', function () {
        console.log('$routeChangeStart');
        //show loading gif
        $timeout(function(){
          $rootScope.layout.loading = true;          
        });
    });
    $rootScope.$on('$routeChangeSuccess', function () {
        console.log('$routeChangeSuccess');
        //hide loading gif
        $timeout(function(){
          $rootScope.layout.loading = false;
        }, 200);
    });
    $rootScope.$on('$routeChangeError', function () {

        //hide loading gif
        console.log('error');
        $rootScope.layout.loading = false;

    });
});;

