(function () {
  'use strict';

  angular
    .module('hires')
    .controller('HiresController', HiresController);

  HiresController.$inject = ['$scope', '$state', 'hireResolve', '$window', 'Authentication'];

  function HiresController($scope, $state, hire, $window, Authentication) {
    var vm = this;

    vm.hire = hire;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Hire
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.hire.$remove($state.go('hires.list'));
      }
    }

    // Save Hire
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.hireForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.hire._id) {
        vm.hire.$update(successCallback, errorCallback);
      } else {
        vm.hire.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('hires.view', {
          hireId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
