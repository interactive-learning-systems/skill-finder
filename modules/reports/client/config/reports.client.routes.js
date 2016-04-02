(function () {
  'use strict';

  angular
    .module('reports.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view/>'
      })
      .state('reports.list', {
        url: '',
        templateUrl: 'modules/reports/client/views/list-reports.client.view.html',
        controller: 'ReportsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reports List'
        }
      })
      .state('reports.create', {
        url: '/create',
        templateUrl: 'modules/reports/client/views/form-reports.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        resolve: {
          reportsResolve: newReports
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Reports Create'
        }
      })
      .state('reports.edit', {
        url: '/:reportsId/edit',
        templateUrl: 'modules/reports/client/views/form-reports.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        resolve: {
          reportsResolve: getReports
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Reports {{ reportsResolve.title }}'
        }
      })
      .state('reports.view', {
        url: '/:reportsId',
        templateUrl: 'modules/reports/client/views/view-reports.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        resolve: {
          reportsResolve: getReports
        },
        data: {
          pageTitle: 'Reports {{ reportsResolve.title }}'
        }
      });
  }

  getReports.$inject = ['$stateParams', 'ReportsService'];

  function getReports($stateParams, ReportsService) {
    return ReportsService.get({
      reportsId: $stateParams.reportsId
    }).$promise;
  }

  newReports.$inject = ['ReportsService'];

  function newReports(ReportsService) {
    return new ReportsService();
  }
}());
