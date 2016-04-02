(function () {
  'use strict';

  angular
    .module('trainings')
    .controller('TrainingsListController', TrainingsListController);

  TrainingsListController.$inject = ['TrainingsService'];

  function TrainingsListController(TrainingsService) {
    var vm = this;

    vm.trainings = TrainingsService.query();
  }
}());
