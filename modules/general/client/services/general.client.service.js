(function () {
  'use strict';

  angular
    .module('generals.services')
    .factory('GeneralsService', GeneralsService);

  GeneralsService.$inject = ['$resource'];

  function GeneralsService($resource) {
    return $resource('api/generals/:generalId', {
      generalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
