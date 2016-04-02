(function () {
  'use strict';

  angular
    .module('performances')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Performances',
      state: 'performances',
      type: 'dropdown',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'performances', {
      title: 'List Performances',
      state: 'performances.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'performances', {
      title: 'Create Performance',
      state: 'performances.create',
      roles: ['user']
    });
  }
}());
