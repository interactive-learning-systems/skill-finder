(function () {
  'use strict';

  angular
  .module('hires')
  .controller('HiresReportsController', HiresReportsController);

  HiresReportsController.$inject = ['$scope', '$state', 'InterviewManager', '$window', 'Authentication'];

  function HiresReportsController($scope, $state, InterviewManager, $window, Authentication) {
    var vm = this;

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

    vm.modules = [
      {
        module: 'Hires',
        value: [
          {
            unit: 'Interviews',
            value: [
              {
                chapter: 'Interview 1',
                value: [
                  { section: 'Knowledge' },
                  { section: 'Skills' },
                  { section: 'Attitude' }
                ]
              },
              {
                chapter: 'Interview 2',
                value: [
                  { section: 'Knowledge' },
                  { section: 'Skills' },
                  { section: 'Attitude' }
                ]
              }
            ]
          },
          {
            unit: 'Locations',
            value: [
              {
                chapter: 'Previous',
                value: [
                  { section: 'Knowledge' },
                  { section: 'Skills' },
                  { section: 'Attitude' }
                ]
              },
              {
                chapter: 'Current',
                value: [
                  { section: 'Knowledge' },
                  { section: 'Skills' },
                  { section: 'Attitude' }
                ]
              }
            ]
          },
          {
            unit: 'Checks',
            value: [
              {
                chapter: 'Checks',
                value: [
                  { section: 'Checks' }
                ]
              }
            ]
          },
          {
            unit: 'Tests',
            value: [
              {
                chapter: 'Tests',
                value: [
                  { section: 'Knowledge' },
                  { section: 'Skills' },
                  { section: 'Attitude' }
                ]
              }
            ]
          }
        ]
      }
    ];

    InterviewManager.loadAllInterviews().then(function(interviews) {
      vm.interviews = interviews;
    });
    vm.report = {
      position: '',
      category: ''
    };

    vm.getSection = function(questions, sections) {

      var tempQuestions = [];
      angular.forEach(questions, function (question) {
        var allOK = true;
        for (var section in sections) {
          if (sections[section].localeCompare(question[section]) !== 0) {
            allOK = false;
          }
        }
        if (allOK) {
          tempQuestions.push(question);
        }
      });
      return tempQuestions;
    };

    function completed(question) {
      if (question.rating.ratingType === 'trueFalse') {
        return !!question.rating.trueFalse;
      } else {
        return question.rating.value > 0;
      }
    }

    vm.getCompleted = function(questions) {
      var tempQuestions = [];
      if (questions) {
        angular.forEach(questions, function (question) {
          if (completed(question)) {
            tempQuestions.push(question);
          }
        });
      }
      return tempQuestions;
    };

    function SumOfFilter() {
      return function (data, key) {
        if (angular.isUndefined(data) && angular.isUndefined(key)) {
          return 0;
        }
        var sum = 0;

        angular.forEach(data, function(v, k) {
          sum = sum + parseInt(v[key], 10);
        });
        return sum;
      };
    }

    vm.getCompletedQuestions = function(interview, section) {
      var questions = interview.questions;
      var sum = 0;

      for (var i = 0; i < questions.length; i++) {
        var isInSection = true;
        var q = questions[i];
        if (section.module) {
          if (q.module.localeCompare(section.module.module) !== 0) {
            isInSection = false;
          }
        }
        if (section.unit) {
          if (q.unit.localeCompare(section.unit.unit) !== 0) {
            isInSection = false;
          }
        }
        if (section.chapter) {
          if (q.chapter.localeCompare(section.chapter.chapter) !== 0) {
            isInSection = false;
          }
        }
        if (section.section) {
          if (q.section.localeCompare(section.section.section) !== 0) {
            isInSection = false;
          }
        }
        if (isInSection) {
          if (q.rating.ratingType.localeCompare('trueFalse') === 0) {
            if (q.rating.trueFalse) {
              sum += 1;
            }
          } else {
            sum = sum + q.rating.value;
          }
        }
      }
      return sum;
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
