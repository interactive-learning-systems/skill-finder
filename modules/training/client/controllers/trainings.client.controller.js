(function () {
  'use strict';

  angular
    .module('trainings')
    .controller('TrainingsController', TrainingsController);

  TrainingsController.$inject = ['$scope', '$state', 'trainingResolve', '$window', 'Authentication'];

  function TrainingsController($scope, $state, training, $window, Authentication) {
    var vm = this;

    vm.training = training;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Training
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.training.$remove($state.go('trainings.list'));
      }
    }

    // Save Training
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.trainingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.training._id) {
        vm.training.$update(successCallback, errorCallback);
      } else {
        vm.training.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('trainings.view', {
          trainingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
