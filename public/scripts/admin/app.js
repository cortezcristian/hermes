'use strict';
/*
$(document).ready(function(){
    $('#side-menu').metisMenu();
    $('head').append('<link rel="stylesheet" type="text/css" href="http://visionmedia.github.io/mocha/example/mocha.css">');
    $.get('/tasks/test', function(data){
        $('.main-con .panel').html(data);
    });
});
*/

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
    'toggle-switch',
    'restangular'
  ])
  .config(function ($routeProvider, $locationProvider, RestangularProvider) {
    //$locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
      .when('/', {
        templateUrl: '/scripts/admin/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/crud/sample', {
        templateUrl: '/scripts/admin/views/sample.html',
        controller: 'SampleCtrl'
      })
      .when('/crud/sample-new', {
        templateUrl: '/forms/sample/create',
        controller: 'SampleNewCtrl'
      })
      .when('/crud/sample-edit/:id', {
        templateUrl: '/forms/sample/create',
        controller: 'SampleEditCtrl',
        resolve: {
          sample: function(Restangular, $route){
            return Restangular.one('samples', $route.current.params.id).get();
          }
        }
      })
      .when('/crud/user', {
        templateUrl: '/scripts/admin/views/user.html',
        controller: 'UserCtrl'
      })
      .when('/crud/user-new', {
        templateUrl: '/forms/user/create',
        controller: 'UserNewCtrl'
      })
      .when('/crud/user-edit/:id', {
        templateUrl: '/forms/user/create',
        controller: 'UserEditCtrl',
        resolve: {
          user: function(Restangular, $route){
            return Restangular.one('users', $route.current.params.id).get();
          }
        }
      })
      .when('/crud/chatrecord', {
        templateUrl: '/scripts/admin/views/chatrecord.html',
        controller: 'ChatRecordCtrl'
      })
      .when('/crud/chatrecord-new', {
        templateUrl: '/forms/chatrecord/create',
        controller: 'ChatRecordNewCtrl'
      })
      .when('/crud/chatrecord-edit/:id', {
        templateUrl: '/forms/chatrecord/create',
        controller: 'ChatRecordEditCtrl',
        resolve: {
          chatrecord: function(Restangular, $route){
            return Restangular.one('chatrecords', $route.current.params.id).get();
          }
        }
      })
      .when('/crud/memo', {
        templateUrl: '/scripts/admin/views/memo.html',
        controller: 'MemoCtrl'
      })
      .when('/crud/memo-new', {
        templateUrl: '/forms/memo/create',
        controller: 'MemoNewCtrl'
      })
      .when('/crud/memo-edit/:id', {
        templateUrl: '/forms/memo/create',
        controller: 'MemoEditCtrl',
        resolve: {
          memo: function(Restangular, $route){
            return Restangular.one('memos', $route.current.params.id).get();
          }
        }
      })
      .when('/crud/memorecord', {
        templateUrl: '/scripts/admin/views/memorecord.html',
        controller: 'MemoRecordCtrl'
      })
      .when('/crud/memorecord-new', {
        templateUrl: '/forms/memorecord/create',
        controller: 'MemoRecordNewCtrl'
      })
      .when('/crud/memorecord-edit/:id', {
        templateUrl: '/forms/memorecord/create',
        controller: 'MemoRecordEditCtrl',
        resolve: {
          memorecord: function(Restangular, $route){
            return Restangular.one('memorecords', $route.current.params.id).get();
          }
        }
      })
      .when('/crud/sector', {
        templateUrl: '/scripts/admin/views/sector.html',
        controller: 'SectorCtrl'
      })
      .when('/crud/sector-new', {
        templateUrl: '/forms/sector/create',
        controller: 'SectorNewCtrl'
      })
      .when('/crud/sector-edit/:id', {
        templateUrl: '/forms/sector/create',
        controller: 'SectorEditCtrl',
        resolve: {
          sector: function(Restangular, $route){
            return Restangular.one('sectors', $route.current.params.id).get();
          }
        }
      })
      .when('/crud/office', {
        templateUrl: '/scripts/admin/views/office.html',
        controller: 'OfficeCtrl'
      })
      .when('/crud/office-new', {
        templateUrl: '/forms/office/create',
        controller: 'OfficeNewCtrl'
      })
      .when('/crud/office-edit/:id', {
        templateUrl: '/forms/office/create',
        controller: 'OfficeEditCtrl',
        resolve: {
          office: function(Restangular, $route){
            return Restangular.one('offices', $route.current.params.id).get();
          }
        }
      })
      .otherwise({






        redirectTo: '/'
      });
      
      RestangularProvider.setBaseUrl('/api/v1');
      RestangularProvider.setRestangularFields({
        id: '_id'
      });
      
      RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
        
        if (operation === 'put') {
          elem._id = undefined;
          return elem;
        }
        return elem;
      });
  });

