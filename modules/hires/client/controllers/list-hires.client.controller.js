(function () {
  'use strict';

  angular
  .module('hires')
  .controller('HiresListController', HiresListController)
  .filter('section', HiresSectionFilter)
  .filter('completed', CompletedFilter);


  function HiresSectionFilter() {
    return function(questions, sections) {

      var tempQuestions = [];
      angular.forEach(questions, function (question) {
        var allOK = true;
        for (var section in sections) {
            if (sections[section].localeCompare(question[section]) != 0) {
              allOK = false;
              //break;
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
      return !!question.rating.trueFalse;
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
        debugger;
        if (angular.isUndefined(data) && angular.isUndefined(key))
            return 0;
        var sum = 0;

        angular.forEach(data,function(v,k){
            sum = sum + parseInt(v[key]);
        });
        return sum;
    };
  }

  HiresListController.$inject = ['$scope', 'HiresService'];

  function HiresListController($scope, HiresService) {
    var vm = this;

    vm.addRow = function(ratingType) {

      vm.questions.push(
        {
          created: Date.now,
          user: 1,
          Interviewee: 2,
          question: vm.newQuestion,
          hint: vm.newQuestionHint,
          module: vm.currentSection.module,
          unit: vm.currentSection.unit,
          chapter: vm.currentSection.chapter,
          section: vm.currentSection.section,
          rating: {
            ratingType: vm.currentQuestionType(),
            trueFalse: null
          }
        }
      );
      vm.newQuestion = "";
      vm.newQuestionHint = "";
    };

    vm.currentQuestionType = function() {
      if (vm.currentSection.unit.localeCompare('Checks') == 0) {
        return 'trueFalse';
      } else if (vm.currentSection.unit.localeCompare('Tests') == 0) {
        return 'xofy';
      } else {
        return 'rating4';
      }
    }

    vm.modules = [
      {
        module: "Hires",
        value: [
          {
            unit: 'Interviews',
            value: [
              {
                chapter:'Interview 1',
                value: [
                  {section: 'Knowledge'},
                  {section: 'Skills'},
                  {section: 'Attitude'},
                ]
              },
              {
                chapter:'Interview 2',
                value: [
                  {section: 'Knowledge'},
                  {section: 'Skills'},
                  {section: 'Attitude'},
                ]
              }
            ]
          },
          {
            unit: 'Locations',
            value: [
              {
                chapter:'Previous',
                value: [
                  {section: 'Knowledge'},
                  {section: 'Skills'},
                  {section: 'Attitude'},
                ]
              },
              {
                chapter:'Current',
                value: [
                  {section: 'Knowledge'},
                  {section: 'Skills'},
                  {section: 'Attitude'},
                ]
              }
            ]
          },
          {
            unit: 'Checks',
            value: [
              {
                chapter:'Checks',
                value: [
                  {section: 'Checks'},
                ]
              },
            ]
          },
          {
            unit: 'Tests',
            value: [
              {
                chapter:'Tests',
                value: [
                  {section: 'Knowledge'},
                  {section: 'Skills'},
                  {section: 'Attitude'},
                ]
              },
            ]
          },
        ]
      }
    ];

    vm.next = function() {
      vm.previousSectionIndices = vm.currentSectionIndices;
      vm.currentSectionIndices = vm.nextSectionIndices;
      vm.nextSectionIndices = {module:vm.nextSectionIndices.module, unit:vm.nextSectionIndices.unit, chapter:vm.nextSectionIndices.chapter, section:vm.nextSectionIndices.section+1};

      var n = vm.nextSectionIndices;
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
        //Done...
      }

      vm.updateSection();
    }

    vm.back = function() {

      vm.nextSectionIndices = vm.currentSectionIndices;
      vm.currentSectionIndices = vm.previousSectionIndices;
      vm.previousSectionIndices = {module:vm.previousSectionIndices.module, unit:vm.previousSectionIndices.unit, chapter:vm.previousSectionIndices.chapter, section:vm.previousSectionIndices.section-1};

      var n = vm.previousSectionIndices;
      if (n.section < 0) {
        n.chapter--;
        if (n.chapter < 0) {
          n.unit--;
          if (n.unit < 0) {
            n.module--;
            if (n.module <0) {
              vm.previousSectionIndices = null;
              vm.updateSection();
              return;
            }
            n.unit =  vm.modules[n.module].value.length-1;
          }
          n.chapter = vm.modules[n.module].value[n.unit].value.length-1;
        }
        n.section = vm.modules[n.module].value[n.unit].value[n.chapter].value.length-1;
      }

      vm.updateSection();
    }

    vm.updateSection = function() {
      vm.previousSection = vm.getSection(vm.previousSectionIndices);
      vm.currentSection = vm.getSection(vm.currentSectionIndices);
      vm.nextSection = vm.getSection(vm.nextSectionIndices);
    }
    vm.getSection = function(s) {
      if (s == null) { return null};

      return {
        module:vm.modules[s.module].module,
        unit:vm.modules[s.module].value[s.unit].unit,
        chapter:vm.modules[s.module].value[s.unit].value[s.chapter].chapter,
        section:vm.modules[s.module].value[s.unit].value[s.chapter].value[s.section].section
      }
    }

    vm.getUnitsForModule = function(module) {
      return vm.modules[0].value;
    }

    vm.previousSectionIndices = null;
    vm.currentSectionIndices = {module: 0, unit: 0, chapter: 0, section: 0};
    vm.nextSectionIndices = {module: 0, unit: 0, chapter: 0, section: 1};

    vm.updateSection();

    vm.currentSection = {

      module:vm.modules[0].module,
      unit:vm.modules[0].value[0].unit,
      chapter:vm.modules[0].value[0].value[0].chapter,
      section:vm.modules[0].value[0].value[0].value[0].section
    };
    vm.nextSection = {
      module:vm.modules[0].module,
      unit:vm.modules[0].value[0].unit,
      chapter:vm.modules[0].value[0].value[0].chapter,
      section:vm.modules[0].value[0].value[0].value[1].section
    };
    vm.previousSection = null;

    //Seed questions
    vm.questions = [{
      created: Date.now,
      user: 1,
      Interviewee: 2,
      question: 'Works?',
      hint: "Hint?",
      module: 'Hires',
      unit: 'Interviews',
      chapter: 'Interview 1',
      section: 'Knowledge',
      rating: {
        ratingType: 'xofy',
        value: 3,
        max: 5
      }
    },
    {
      created: Date.now,
      user: 1,
      Interviewee: 2,
      question: 'Number 2?',
      module: 'Hires',
      unit: 'Interviews',
      chapter: 'Interview 1',
      section: 'Knowledge',
      rating: {
        ratingType: 'rating4',
        value: 3
      }
    },
    {
      created: Date.now,
      user: 1,
      Interviewee: 2,
      question: 'Number 3?',
      module: 'Hires',
      unit: 'Interviews',
      chapter: 'Interview 1',
      section: 'Knowledge',
      rating: {
        ratingType: 'rating4',
        value: 0
      }
    },
    {
      created: Date.now,
      user: 1,
      Interviewee: 2,
      question: 'Number 2?',
      module: 'Hires',
      unit: 'Locations',
      chapter: 'Current',
      section: 'Knowledge',
      rating: {
        ratingType: 'rating4',
        value: 0
      }
    }
  ];

  }
}());
