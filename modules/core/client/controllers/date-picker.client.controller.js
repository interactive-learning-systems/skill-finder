(function () {
  'use strict';

  angular
  .module('core')
  .controller('DatePickerController', DatePickerController);

  DatePickerController.$inject = ['$scope', '$state', '$window', 'Authentication'];

  function DatePickerController($scope, $state, $window, Authentication) {

    var dp = this;

    dp.valuationDate = new Date();
    dp.valuationDatePickerIsOpen = false;
    dp.opens = [];

    $scope.$watch(function () {
      return dp.valuationDatePickerIsOpen;
    }, function(value) {
      dp.opens.push("valuationDatePickerIsOpen: " + value + " at: " + new Date());
    });

    dp.valuationDatePickerOpen = function ($event) {

      if ($event) {
        $event.preventDefault();
        $event.stopPropagation(); // This is the magic
      }
      this.valuationDatePickerIsOpen = true;
    };
  }

}());
