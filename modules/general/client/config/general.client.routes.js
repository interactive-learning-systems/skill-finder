(function () {
  'use strict';

  angular
    .module('generals.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('generals', {
        abstract: true,
        url: '/generals',
        template: '<ui-view/>'
      })
      .state('generals.list', {
        url: '',
        templateUrl: 'modules/generals/client/views/list-generals.client.view.html',
        controller: 'GeneralsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Generals List'
        }
      })
      .state('generals.create', {
        url: '/create',
        templateUrl: 'modules/generals/client/views/form-general.client.view.html',
        controller: 'GeneralsController',
        controllerAs: 'vm',
        resolve: {
          generalResolve: newGeneral
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Generals Create'
        }
      })
      .state('generals.edit', {
        url: '/:generalId/edit',
        templateUrl: 'modules/generals/client/views/form-general.client.view.html',
        controller: 'GeneralsController',
        controllerAs: 'vm',
        resolve: {
          generalResolve: getGeneral
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit General {{ generalResolve.title }}'
        }
      })
      .state('generals.view', {
        url: '/:generalId',
        templateUrl: 'modules/generals/client/views/view-general.client.view.html',
        controller: 'GeneralsController',
        controllerAs: 'vm',
        resolve: {
          generalResolve: getGeneral
        },
        data: {
          pageTitle: 'General {{ generalResolve.title }}'
        }
      });
  }

  getGeneral.$inject = ['$stateParams', 'GeneralsService'];

  function getGeneral($stateParams, GeneralsService) {
    return GeneralsService.get({
      generalId: $stateParams.generalId
    }).$promise;
  }

  newGeneral.$inject = ['GeneralsService'];

  function newGeneral(GeneralsService) {
    return new GeneralsService();
  }
}());
