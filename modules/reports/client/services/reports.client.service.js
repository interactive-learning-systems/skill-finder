(function () {
  'use strict';

  angular
    .module('reports.services')
    .factory('ReportsService', ReportsService);

  ReportsService.$inject = ['$resource'];

  function ReportsService($resource) {
    return $resource('api/reports/:reportsId', {
      reportsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
