(function () {
  'use strict';

  angular
    .module('hires')
    .controller('HiresListController', HiresListController);

  HiresListController.$inject = ['HiresService'];

  function HiresListController(HiresService) {
    var vm = this;

    vm.hires = HiresService.query();
  }
}());
