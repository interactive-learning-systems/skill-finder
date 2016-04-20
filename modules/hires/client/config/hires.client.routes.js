(function () {
  'use strict';

  angular
    .module('hires.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hires', {
        abstract: true,
        url: '/hires',
        template: '<ui-view/>'
      })
      .state('hires.interview', {
        url: '/interview',
        templateUrl: 'modules/hires/client/views/interview-hires.client.view.html',
        controller: 'InterviewHiresController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'SkillFinderQ Hiring Module - Interview'
        }
      })
      .state('hires.interview_1', {
        url: '/interview_1',
        templateUrl: 'modules/hires/client/views/list-hires.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'SkillFinderQ Hiring Module - Interview 1',
          section: { module: 0, unit: 0, chapter: 0, section: 0 }
        }
      })
      .state('hires.interview_2', {
        url: '/interview_2',
        templateUrl: 'modules/hires/client/views/list-hires.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'SkillFinderQ Hiring Module - Interview 2',
          section: { module: 0, unit: 0, chapter: 1, section: 0 }
        }
      })
      .state('hires.location_1', {
        url: '/location_1',
        templateUrl: 'modules/hires/client/views/list-hires.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'SkillFinderQ Hiring Module - Previous Location',
          section: { module: 0, unit: 1, chapter: 0, section: 0 }
        }
      })
      .state('hires.location_2', {
        url: '/location_2',
        templateUrl: 'modules/hires/client/views/list-hires.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'SkillFinderQ Hiring Module - Current Location',
          section: { module: 0, unit: 1, chapter: 1, section: 0 }
        }
      })
      .state('hires.checks', {
        url: '/checks',
        templateUrl: 'modules/hires/client/views/list-hires.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'SkillFinderQ Hiring Module - Checks',
          section: { module: 0, unit: 2, chapter: 0, section: 0 }
        }
      })
      .state('hires.tests', {
        url: '/tests',
        templateUrl: 'modules/hires/client/views/list-hires.client.view.html',
        controller: 'HiresListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'SkillFinderQ Hiring Module - Tests',
          section: { module: 0, unit: 3, chapter: 0, section: 0 }
        }
      })
      .state('hires.comparisonReport', {
        url: '/reports/comparison',
        templateUrl: 'modules/hires/client/views/comparison-report-hires.client.view.html',
        controller: 'HiresReportsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'SkillFinderQ Hiring Module - Comparison Report'
        }
      })
      .state('hires.candidateReport', {
        url: '/reports/candidate',
        templateUrl: 'modules/hires/client/views/individual-report-hires.client.view.html',
        controller: 'HiresIndividualReportController',
        controllerAs: 'vm',
        params: {
          id: {}
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'SkillFinderQ Hiring Module - Individual Report'
        }
      });
  }

}());
