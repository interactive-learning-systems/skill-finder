(function () {
  'use strict';

  angular
    .module('reports')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Reports',
      state: 'reports',
      class: 'fa-line-chart',
      type: 'dropdown',
      position: 6,
      roles: ['*']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reports', {
      title: 'Candidate Comparisons',
      state: 'reports.candidateComparison',
      class: 'fa-circle-o',
      position: 1,
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reports', {
      title: 'Candidate Summary',
      state: 'reports.candidateSummary',
      class: 'fa-circle-o',
      position: 2,
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reports', {
      title: 'Interviewee Comparison',
      state: 'reports.intervieweeComparison',
      class: 'fa-circle-o',
      position: 3,
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reports', {
      title: 'Hiring History',
      state: 'reports.hiringHistory',
      class: 'fa-circle-o',
      position: 4,
      roles: ['user']
    });

  }
}());
