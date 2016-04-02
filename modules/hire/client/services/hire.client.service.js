(function () {
  'use strict';

  angular
    .module('hires.services')
    .factory('HiresService', HiresService);

  HiresService.$inject = ['$resource'];

  function HiresService($resource) {
    return $resource('api/hires/:hireId', {
      hireId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
