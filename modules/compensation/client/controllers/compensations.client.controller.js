(function () {
  'use strict';

  angular
    .module('compensations')
    .controller('CompensationsController', CompensationsController);

  CompensationsController.$inject = ['$scope', '$state', 'compensationResolve', '$window', 'Authentication'];

  function CompensationsController($scope, $state, compensation, $window, Authentication) {
    var vm = this;

    vm.compensation = compensation;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Compensation
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.compensation.$remove($state.go('compensations.list'));
      }
    }

    // Save Compensation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.compensationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.compensation._id) {
        vm.compensation.$update(successCallback, errorCallback);
      } else {
        vm.compensation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('compensations.view', {
          compensationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
