(function () {
  'use strict';

  angular
    .module('generals')
    .controller('GeneralsController', GeneralsController);

  GeneralsController.$inject = ['$scope', '$state', 'generalResolve', '$window', 'Authentication'];

  function GeneralsController($scope, $state, general, $window, Authentication) {
    var vm = this;

    vm.general = general;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing General
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.general.$remove($state.go('generals.list'));
      }
    }

    // Save General
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.generalForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.general._id) {
        vm.general.$update(successCallback, errorCallback);
      } else {
        vm.general.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('generals.view', {
          generalId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
