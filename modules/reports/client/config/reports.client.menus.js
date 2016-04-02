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
      type: 'dropdown',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'reports', {
      title: 'List Reports',
      state: 'reports.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reports', {
      title: 'Create Reports',
      state: 'reports.create',
      roles: ['user']
    });
  }
}());
