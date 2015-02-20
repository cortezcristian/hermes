'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MemosNewCtrl
 * @description
 * # MemosNewCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MemosNewCtrl', function ($scope, $routeParams, PeopleService, $interval) {
      
      if(typeof chatInterval !== 'undefined') {
        //Cancel it
        $interval.cancel(chatInterval);
      }
      
      var configS2 = {
            placeholder: "Destinatarios...",
            ajax: {
                url : '/services/search/people/tags',
                dataType: 'json', 
                quietMillis: 250,
                data: function (term, page) {
                    return {
                        keyword: term
                    };
                },
                results: function (data, page) {
                    console.log(data);
                    return { results: data };
                },
                cache: true
            },
            tags:[],
            //minimumInputLength: 3,
            id: function(data){ return data._id; },
            dropdownCssClass: "bigdrop",
            initSelection: function(element, callback) {
                console.log(element, callback);
                callback(data);
            },
            formatSelection: function(data) {
                return data.name;
            },
            formatResult: function(data) {
                var markup = '<div class="row-fluid">';
                markup += data.name + " - " + data.email; 
                markup += '</div>';
                return markup;
            }
        };
      var usuario = $('#usuarios');
      usuario.select2(configS2);
      usuario.on('select2-selecting', function(e) {
          console.log(e);
      });
      
      // https://github.com/lemonde/angular-ckeditor
      $('#message').wysihtml5();

  });
