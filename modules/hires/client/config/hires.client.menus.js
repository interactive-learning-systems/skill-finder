(function () {
  'use strict';

  angular
    .module('hires')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    menuService.addMenuItem('topbar', {
      title: 'Hires',
      state: 'hires',
      class: 'fa-user',
      type: 'dropdown',
      position: 1,
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires', {
      title: 'Interviews',
      state: 'hires.interviews',
      class: 'fa-circle-o',
      type: 'dropdown',
      position: 1,
      roles: ['user']
    });
    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires.interviews', {
      title: 'Interview 1',
      state: 'hires.interview_1_knowledge',
      class: 'fa-circle-o',
      position: 1,
      roles: ['user']
    });
    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires.interviews', {
      title: 'Interview 2',
      state: 'hires.interview_2_knowledge',
      class: 'fa-circle-o',
      position: 2,
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires', {
      title: 'Locations',
      state: 'hires.locations',
      class: 'fa-circle-o',
      type: 'dropdown',
      position: 2,
      roles: ['user']
    });
    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires.locations', {
      title: 'Previous',
      state: 'hires.location.1',
      class: 'fa-circle-o',
      position: 1,
      roles: ['user']
    });
    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires.locations', {
      title: 'Current',
      state: 'hires.location.2',
      class: 'fa-circle-o',
      position: 2,
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires', {
      title: 'Checks',
      state: 'hires.checks',
      class: 'fa-circle-o',
      position: 3,
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires', {
      title: 'Tests',
      state: 'hires.tests',
      class: 'fa-circle-o',
      position: 4,
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires', {
      title: 'Candidate Report',
      state: 'hires.candidateReport',
      class: 'fa-circle-o',
      position: 5,
      roles: ['user']
    });

  }
}());
