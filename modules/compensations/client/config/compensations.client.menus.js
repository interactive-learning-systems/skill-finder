(function () {
  'use strict';

  angular
    .module('compensations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Pay & Benefits',
      state: 'compensations',
      class: 'fa-dollar',
      position: 3,
      roles: ['*']
    });
  }
}());
