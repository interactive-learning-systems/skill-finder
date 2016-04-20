(function () {
  'use strict';

  angular
  .module('hires')
  .controller('InterviewHiresController', InterviewHiresController);

  InterviewHiresController.$inject = ['$scope', '$state', 'InterviewManager', '$window', 'Authentication'];

  function InterviewHiresController($scope, $state, InterviewManager, $window, Authentication) {
    var vm = this;

    vm.interview = InterviewManager.retrieveCurrentInterview();

    vm.authentication = Authentication;
    vm.error = null;

    vm.locations = [
      'Murphy, TX',
      'Keller, TX',
      'Allen, TX',
      'North San Antonio, TX',
      'Alamo Ranch, TX'
    ];

    vm.positions = [
      'Director',
      'Assistant Director',
      'Lead Teacher',
      'Assistant Teacher',
      'Substitute',
      'After School Care'
    ];

    vm.categories = [
      'Infant',
      'Toddler',
      'Pre-Primary',
      'Primary',
      'Elementary',
      '1st Grade',
      '2nd Grade',
      '3rd Grade',
      'After School Care'
    ];

    vm.next = function() {
      saveOrUpdate(true);
    };

    // Save Interview
    function saveOrUpdate(isValid) {
      vm.interview.saveOrUpdate().then(function(response) {
        vm.interview.setData(response.data);
        InterviewManager.setCurrentInterview(vm.interview);
        $state.go('hires.interview_1');
      }
    ).catch(function() {
      $scope.error = 'Unable to save the interview';
    });
    }
  }
}());
