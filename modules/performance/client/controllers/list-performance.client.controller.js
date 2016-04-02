(function () {
  'use strict';

  angular
    .module('performances')
    .controller('PerformancesListController', PerformancesListController);

  PerformancesListController.$inject = ['PerformancesService'];

  function PerformancesListController(PerformancesService) {
    var vm = this;

    vm.performances = PerformancesService.query();
  }
}());
