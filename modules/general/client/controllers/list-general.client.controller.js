(function () {
  'use strict';

  angular
    .module('generals')
    .controller('GeneralsListController', GeneralsListController);

  GeneralsListController.$inject = ['GeneralsService'];

  function GeneralsListController(GeneralsService) {
    var vm = this;

    vm.generals = GeneralsService.query();
  }
}());
