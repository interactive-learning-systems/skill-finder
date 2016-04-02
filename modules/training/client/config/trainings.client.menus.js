(function () {
  'use strict';

  angular
    .module('trainings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Trainings',
      state: 'trainings',
      type: 'dropdown',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'trainings', {
      title: 'List Trainings',
      state: 'trainings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'trainings', {
      title: 'Create Training',
      state: 'trainings.create',
      roles: ['user']
    });
  }
}());
