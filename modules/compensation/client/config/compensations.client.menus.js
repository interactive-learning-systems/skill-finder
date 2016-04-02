(function () {
  'use strict';

  angular
    .module('compensations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Compensations',
      state: 'compensations',
      type: 'dropdown',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'compensations', {
      title: 'List Compensations',
      state: 'compensations.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'compensations', {
      title: 'Create Compensation',
      state: 'compensations.create',
      roles: ['user']
    });
  }
}());
