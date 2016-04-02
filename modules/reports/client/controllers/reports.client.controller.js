(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsController', ReportsController);

  ReportsController.$inject = ['$scope', '$state', 'reportsResolve', '$window', 'Authentication'];

  function ReportsController($scope, $state, reports, $window, Authentication) {
    var vm = this;

    vm.reports = reports;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Reports
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.reports.$remove($state.go('reports.list'));
      }
    }

    // Save Reports
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reportsForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.reports._id) {
        vm.reports.$update(successCallback, errorCallback);
      } else {
        vm.reports.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reports.view', {
          reportsId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
