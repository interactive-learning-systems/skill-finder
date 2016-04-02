(function () {
  'use strict';

  angular
    .module('performances')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Performance',
      state: 'performances',
      class: 'fa-rocket',
      position: 4,
      roles: ['*']
    });
  }
}());
