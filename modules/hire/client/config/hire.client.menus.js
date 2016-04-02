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
      type: 'dropdown',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'hires', {
      title: 'List Hires',
      state: 'hires.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hires', {
      title: 'Create Hire',
      state: 'hires.create',
      roles: ['user']
    });
  }
}());
