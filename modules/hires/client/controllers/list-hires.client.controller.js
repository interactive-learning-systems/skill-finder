(function () {
  'use strict';

  angular
  .module('hires')
  .controller('HiresListController', HiresListController);

  function HiresSectionFilter() {
    return function(questions, sections) {

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
  }

  function completed(question) {
    if (question.rating.ratingType === 'trueFalse') {
      return true;  // TMW
    } else {
      return question.rating.value > 0;
    }
  }

  function CompletedFilter() {
    return function(questions) {
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
  }

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

  HiresListController.$inject = ['$scope', '$state', 'InterviewManager', 'QuestionManager'];

  function HiresListController($scope, $state, InterviewManager, QuestionManager) {
    var vm = this;
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

    vm.interview = InterviewManager.retrieveCurrentInterview();
    if (!vm.interview._id) $state.go('hires.interview');

    vm.addRow = function() {
      var question = {
        question: vm.newQuestion, hint: vm.newQuestionHint,
        module: vm.currentSection.module, unit: vm.currentSection.unit, chapter: vm.currentSection.chapter, section: vm.currentSection.section,
        rating: vm.currentRatingType()
      };
      vm.interview.questions.push(question);
      QuestionManager.setQuestions(question).save();
      vm.newQuestion = '';
      vm.newQuestionHint = '';
    };

    vm.currentRatingType = function() {
      switch (vm.currentSection.unit) {
        case 'Checks': return {
          ratingType: 'trueFalse',
          max: 1
        };
        case 'Tests': return {
          ratingType: 'xofy',
          max: 1
        };
        default: return {
          ratingType: 'rating4',
          max: 4
        };
      }
    };

    vm.saveOrUpdate = function(isValid, newState, newStateParams) {
      vm.interview.saveOrUpdate().then(function(response) {
        vm.interview.setData(response.data);
        if (newState) {
          $state.go(newState, newStateParams);
        }
      }).catch(function() {
        $scope.error = 'Unable to save the interview';
      });
    };

    vm.updateSection = function() {
      vm.previousSection = vm.getSection(vm.previousSectionIndices);
      vm.currentSection = vm.getSection(vm.currentSectionIndices);
      vm.nextSection = vm.getSection(vm.nextSectionIndices);
    };

    vm.getSection = function(s) {
      if (s == null || s.module >= vm.modules.length) {
        return null;
      }

      return {
        module: vm.modules[s.module].module,
        unit: vm.modules[s.module].value[s.unit].unit,
        chapter: vm.modules[s.module].value[s.unit].value[s.chapter].chapter,
        section: vm.modules[s.module].value[s.unit].value[s.chapter].value[s.section].section
      };
    };

    vm.getNextSection = function(s) {
      var n = {
        module: s.module,
        unit: s.unit,
        chapter: s.chapter,
        section: s.section + 1
      };

      if (n.section >= vm.modules[n.module].value[n.unit].value[n.chapter].value.length) {
        n.chapter++;
        n.section = 0;
      }
      if (n.chapter >= vm.modules[n.module].value[n.unit].value.length) {
        n.unit++;
        n.chapter = 0;
      }
      if (n.unit >= vm.modules[n.module].value.length) {
        n.module++;
        n.unit = 0;
      }
      if (n.modlue > vm.modules.length) {
        return null;
      }
      return n;
    };

    vm.getPreviousSection = function(s) {
      var n = {
        module: s.module,
        unit: s.unit,
        chapter: s.chapter,
        section: s.section - 1 };

      if (n.section < 0) {
        n.chapter--;
        if (n.chapter < 0) {
          n.unit--;
          if (n.unit < 0) {
            n.module--;
            if (n.module < 0) {
              return null;
            }
            n.unit = vm.modules[n.module].value.length - 1;
          }
          n.chapter = vm.modules[n.module].value[n.unit].value.length - 1;
        }
        n.section = vm.modules[n.module].value[n.unit].value[n.chapter].value.length - 1;
      }
      return n;
    };

    vm.currentSectionIndices = $state.current.data.section;
    vm.previousSectionIndices = vm.getPreviousSection(vm.currentSectionIndices);
    vm.nextSectionIndices = vm.getNextSection(vm.currentSectionIndices);
    vm.updateSection();

    vm.next = function() {
      var newState = null;  // Stay in the current state
      var newStateParams = null;  // Stay in the current state
      if (vm.nextSection === null) {
        newState = 'hires.candidateReport';
        newStateParams = { id: vm.interview._id };
        InterviewManager.clearCurrentInterview();
      } else {
        vm.previousSectionIndices = vm.currentSectionIndices;
        vm.currentSectionIndices = vm.nextSectionIndices;
        vm.nextSectionIndices = vm.getNextSection(vm.nextSectionIndices);
        vm.updateSection();
      }
      vm.saveOrUpdate(true, newState, newStateParams);
    };

    vm.back = function() {
      var newState = null;  // Stay in the current state
      if (vm.previousSection === null) {
        newState = 'hires.interview';
      } else {
        vm.nextSectionIndices = vm.currentSectionIndices;
        vm.currentSectionIndices = vm.previousSectionIndices;
        vm.previousSectionIndices = vm.getPreviousSection(vm.previousSectionIndices);
        vm.updateSection();
      }
      vm.saveOrUpdate(true, newState);
    };

    vm.getUnits = function() {
      return vm.modules[0].value;
    };
    vm.updateSection();

  }
}());
