(function () {
  'use strict';

  angular
    .module('trainings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Orientation & Training',
      state: 'trainings',
      class: 'fa-hand-o-right',
      position: 2,
      roles: ['*']
    });
  }
}());
