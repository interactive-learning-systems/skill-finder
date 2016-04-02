(function () {
  'use strict';

  angular
    .module('performances.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('performances', {
        abstract: true,
        url: '/performances',
        template: '<ui-view/>'
      })
      .state('performances.list', {
        url: '',
        templateUrl: 'modules/performances/client/views/list-performances.client.view.html',
        controller: 'PerformancesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Performances List'
        }
      })
      .state('performances.create', {
        url: '/create',
        templateUrl: 'modules/performances/client/views/form-performance.client.view.html',
        controller: 'PerformancesController',
        controllerAs: 'vm',
        resolve: {
          performanceResolve: newPerformance
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Performances Create'
        }
      })
      .state('performances.edit', {
        url: '/:performanceId/edit',
        templateUrl: 'modules/performances/client/views/form-performance.client.view.html',
        controller: 'PerformancesController',
        controllerAs: 'vm',
        resolve: {
          performanceResolve: getPerformance
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Performance {{ performanceResolve.title }}'
        }
      })
      .state('performances.view', {
        url: '/:performanceId',
        templateUrl: 'modules/performances/client/views/view-performance.client.view.html',
        controller: 'PerformancesController',
        controllerAs: 'vm',
        resolve: {
          performanceResolve: getPerformance
        },
        data: {
          pageTitle: 'Performance {{ performanceResolve.title }}'
        }
      });
  }

  getPerformance.$inject = ['$stateParams', 'PerformancesService'];

  function getPerformance($stateParams, PerformancesService) {
    return PerformancesService.get({
      performanceId: $stateParams.performanceId
    }).$promise;
  }

  newPerformance.$inject = ['PerformancesService'];

  function newPerformance(PerformancesService) {
    return new PerformancesService();
  }
}());
