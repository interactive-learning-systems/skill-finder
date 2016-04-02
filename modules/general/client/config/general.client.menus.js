(function () {
  'use strict';

  angular
    .module('generals')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Exit',
      state: 'exit',
      class: 'fa-sign-out',
      position: 5,
      roles: ['*']
    });
  }
}());
