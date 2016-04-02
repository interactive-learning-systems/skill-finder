(function () {
  'use strict';

  angular
    .module('compensations')
    .controller('CompensationsListController', CompensationsListController);

  CompensationsListController.$inject = ['CompensationsService'];

  function CompensationsListController(CompensationsService) {
    var vm = this;

    vm.compensations = CompensationsService.query();
  }
}());
