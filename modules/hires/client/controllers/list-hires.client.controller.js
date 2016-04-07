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

    vm.addRow = function(questionText, ratingType) {

      vm.questions.push(
        {
          created: Date.now,
          user: 1,
          Interviewee: 2,
          question: questionText,
          module: vm.currentSection.module,
          unit: vm.currentSection.unit,
          chapter: vm.currentSection.chapter,
          section: vm.currentSection.section,
          rating: {
            ratingType: ratingType,
            trueFalse: null
          }
        }
      );
    };

    vm.currentQuestionType = function() {
      if (vm.currentSection.module.localeCompare('Hires')) {
        return 'trueFalse';
      } else {
        return 'rating4';
      }
    }

    vm.next = function() {
      vm.previousSection = vm.currentSection;
      vm.currentSection = {module:'Hires', unit:'Interviews', chapter:'Interview 1', section:'Skills'};
      vm.nextSection = {module:'Hires', unit:'Interviews', chapter:'Interview 1', section:'Attitude'};
    }

    vm.back = function() {
      vm.nextSection = vm.currentSection;
      vm.currentSection = {module:'Hires', unit:'Interviews', chapter:'Interview 1', section:'Knowledge'};
      vm.previousSection = null;
    }

    vm.getUnitsForModule = function(module) {
      console.log(vm.modules[0].value);
      return vm.modules[0].value;
    }

    vm.currentSection = {module:'Hires', unit:'Interviews', chapter:'Interview 1', section:'Knowledge'};
    vm.nextSection = {module:'Hires', unit:'Interviews', chapter:'Interview 1', section:'Knowledge'};
    vm.previousSection = null;

    vm.modules = [
      {
        module: "Hire",
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
                  {section: 'Knowledge'},
                  {section: 'Skills'},
                  {section: 'Attitude'},
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

/*

vm.modules = [
  {
    module: "Hire",
    value: [
      {
        unit: 'Interviews',
        value: [
          { chapter:'Interview 1', section:'Knowledge' },
          { chapter:'Interview 1', section:'Skills' },
          { chapter:'Interview 1', section:'Attitude' },
          { chapter:'Interview 2', section:'Knowledge' },
          { chapter:'Interview 2', section:'Skills' },
          { chapter:'Interview 2', section:'Attitude' }
        ]
      },
      {
        unit: 'Locations',
        value: [
          { chapter:'Location 1', section:'Knowledge' },
          { chapter:'Location 2', section:'Knowledge' }
        ]
      },
      {
        unit: 'Checks',
        value: [
          { chapter:'Checks', section:'Knowledge' },
          { chapter:'Checks', section:'Skills' },
          { chapter:'Checks', section:'Attitude' }
        ]
      }
    ]
  }
];

*/


/*
    vm.units = [
      {
        name: 'Interviews',
        value: [
          { unit:'Interview 1', section:'Knowledge' },
          { unit:'Interview 1', section:'Skills' },
          { unit:'Interview 1', section:'Attitude' },
          { unit:'Interview 2', section:'Knowledge' },
          { unit:'Interview 2', section:'Skills' },
          { ection2:'Interview 2', section:'Attitude' }
        ]
      },
      {
        name: 'Locations',
        value: [
          { unit:'Location 1', section:'Knowledge' },
          { unit:'Location 2', section:'Knowledge' }
        ]
      },
      {
        name: 'Checks',
        value: [
          { unit:'Checks', section:'Knowledge' },
          { unit:'Checks', section:'Skills' },
          { unit:'Checks', section:'Attitude' }
        ]
      }
    ];
*/

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
        ratingType: 'rating4',
        value: 3
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
