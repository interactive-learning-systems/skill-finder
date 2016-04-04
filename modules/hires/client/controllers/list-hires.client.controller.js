(function () {
  'use strict';

  angular
  .module('hires')
  .controller('HiresListController', HiresListController)
  .filter('section', HiresSectionFilter)
  .filter('completed', CompletedFilter);

  function HiresSectionFilter() {
    return function(questions, selectionSection) {

      var tempQuestions = [];
      angular.forEach(questions, function (question) {
        var ok = true;
        for (var prop in selectionSection) {
          if (selectionSection[prop].localeCompare(question[prop])) {
            ok = false;
            break;
          }
        }
        if (ok) {
          tempQuestions.push(question);
        }
      });
      return tempQuestions;
    };
  }

  function CompletedFilter() {
    return function(questions) {
      var tempQuestions = [];
      angular.forEach(questions, function (question) {
        if (question.rating.rated === true) {
          tempQuestions.push(question);
        }
      });
      return tempQuestions;
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
          section1: 'Hires',
          section2: 'Interview 1',
          section3: 'Knowledge',
          rating: {
            rated: false,
            ratingType: ratingType,
            trueFalse: null
          }
        }
      );
    };

    vm.questions = [{
      created: Date.now,
      user: 1,
      Interviewee: 2,
      question: 'Works?',
      section1: 'Hires',
      section2: 'Interview 1',
      section3: 'Knowledge',
      rating: {
        rated: false,
        ratingType: 'trueFalse',
        trueFalse: null,
        value: 0
      }
    },
    {
      created: Date.now,
      user: 1,
      Interviewee: 2,
      question: 'Number 2?',
      section1: 'Hires',
      section2: 'Interview 1',
      section3: 'Knowledge',
      rating: {
        rated: true,
        ratingType: 'trueFalse',
        trueFalse: true
      }
    },
    {
      created: Date.now,
      user: 1,
      Interviewee: 2,
      question: 'Number 3?',
      section1: 'Hires',
      section2: 'Interview 1',
      section3: 'Knowledge',
      rating: {
        rated: false,
        ratingType: 'rating4',
        value: 0
      }
    },
    {
      created: Date.now,
      user: 1,
      Interviewee: 2,
      question: 'Number 2?',
      section1: 'Hires',
      section2: 'Interview 2',
      section3: 'Knowledge',
      rating: {
        rated: false,
        ratingType: 'rating5',
        value: 0
      }
    }
  ];

  }
}());
