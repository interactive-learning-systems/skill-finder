(function () {
  'use strict';

  angular
    .module('performances')
    .controller('PerformancesController', PerformancesController);

  PerformancesController.$inject = ['$scope', '$state', 'performanceResolve', '$window', 'Authentication'];

  function PerformancesController($scope, $state, performance, $window, Authentication) {
    var vm = this;

    vm.performance = performance;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Performance
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.performance.$remove($state.go('performances.list'));
      }
    }

    // Save Performance
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.performanceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.performance._id) {
        vm.performance.$update(successCallback, errorCallback);
      } else {
        vm.performance.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('performances.view', {
          performanceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
