(function () {
  'use strict';

  angular
    .module('trainings.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('trainings', {
        abstract: true,
        url: '/trainings',
        template: '<ui-view/>'
      })
      .state('trainings.list', {
        url: '',
        templateUrl: 'modules/trainings/client/views/list-trainings.client.view.html',
        controller: 'TrainingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Trainings List'
        }
      })
      .state('trainings.create', {
        url: '/create',
        templateUrl: 'modules/trainings/client/views/form-training.client.view.html',
        controller: 'TrainingsController',
        controllerAs: 'vm',
        resolve: {
          trainingResolve: newTraining
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Trainings Create'
        }
      })
      .state('trainings.edit', {
        url: '/:trainingId/edit',
        templateUrl: 'modules/trainings/client/views/form-training.client.view.html',
        controller: 'TrainingsController',
        controllerAs: 'vm',
        resolve: {
          trainingResolve: getTraining
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Training {{ trainingResolve.title }}'
        }
      })
      .state('trainings.view', {
        url: '/:trainingId',
        templateUrl: 'modules/trainings/client/views/view-training.client.view.html',
        controller: 'TrainingsController',
        controllerAs: 'vm',
        resolve: {
          trainingResolve: getTraining
        },
        data: {
          pageTitle: 'Training {{ trainingResolve.title }}'
        }
      });
  }

  getTraining.$inject = ['$stateParams', 'TrainingsService'];

  function getTraining($stateParams, TrainingsService) {
    return TrainingsService.get({
      trainingId: $stateParams.trainingId
    }).$promise;
  }

  newTraining.$inject = ['TrainingsService'];

  function newTraining(TrainingsService) {
    return new TrainingsService();
  }
}());
