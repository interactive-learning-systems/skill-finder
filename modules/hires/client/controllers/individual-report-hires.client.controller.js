(function () {
  'use strict';

  angular
  .module('hires')
  .controller('HiresIndividualReportController', HiresIndividualReportController);

  HiresIndividualReportController.$inject = ['$scope', '$state', '$stateParams', 'InterviewManager', '$window', 'Authentication'];

  function HiresIndividualReportController($scope, $state, $stateParams, InterviewManager, $window, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.interview = InterviewManager.retrieveCurrentInterview();

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

    InterviewManager.getInterview($stateParams.id).then(function(interview) {
      vm.interview = interview;
    });
    vm.report = {
      position: '',
      category: ''
    };

    vm.getQuestions = function(section) {
      var currentQuestions = [];
      if (vm.interview) {
        var questions = vm.interview.questions;

        if (questions) {
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
              currentQuestions.push(q);
            }
          }
        }
      }
      return currentQuestions;
    };

  }
}());
