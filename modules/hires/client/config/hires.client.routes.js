(function () {
  'use strict';

  angular
    .module('hires.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hire.interview.1', {
        url: '/interview1',
        templateUrl: 'modules/hire/client/views/form-hire.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Interview 1'
        }
      })
      .state('hires', {
        abstract: true,
        url: '/hires',
        template: '<ui-view/>'
      })
      .state('hires.list', {
        url: '',
        templateUrl: 'modules/hires/client/views/list-hires.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Hires List'
        }
      })
      .state('hires.interview_1', {
        url: '/interview_1',
        templateUrl: 'modules/hires/client/views/list-hires.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        resolve: {
          hireResolve: newHire
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Hire: Interview 1 - Knowledge',
        }
      })
      .state('hires.interview_2', {
        url: '/interview_2_knowledge',
        templateUrl: 'modules/hires/client/views/form-hire.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        resolve: {
          hireResolve: newHire
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Hire: Interview 2 - Knowledge',
        }
      })
      .state('hires.edit', {
        url: '/:hireId/edit',
        templateUrl: 'modules/hires/client/views/form-hire.client.view.html',
        controller: 'HiresController',
        controllerAs: 'vm',
        resolve: {
          hireResolve: getHire
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Hire {{ hireResolve.title }}'
        }
      })
      .state('hires.view', {
        url: '/:hireId',
        templateUrl: 'modules/hires/client/views/view-hire.client.view.html',
        controller: 'HiresController',
        controllerAs: 'vm',
        resolve: {
          hireResolve: getHire
        },
        data: {
          pageTitle: 'Hire {{ hireResolve.title }}'
        }
      });
  }

  getHire.$inject = ['$stateParams', 'HiresService'];

  function getHire($stateParams, HiresService) {
    return HiresService.get({
      hireId: $stateParams.hireId
    }).$promise;
  }

  newHire.$inject = ['HiresService'];

  function newHire(HiresService) {
    return new HiresService();
  }
}());
