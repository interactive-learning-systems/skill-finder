(function () {
  'use strict';

  angular
  .module('hires.filters')
  .filter('percentage', PercentageFilter)
  .filter('interested', InterestedInterviewFilter)
  .filter('section', HiresSectionFilter)
  .filter('completed', CompletedFilter);


  function PercentageFilter() {
    return function (input, decimals) {
      return Math.floor(input * 100, decimals) + '%';
    };
  }

  function InterestedInterviewFilter() {
    return function(interviews, interested) {
      var tempInterviews = [];
      angular.forEach(interviews, function (interview) {
        var stillInterested = true;
        if (interested.position.length > 0 && interview.position.localeCompare(interested.position) !== 0) {
          stillInterested = false;
        }
        if (interested.category.length > 0 && interview.category.localeCompare(interested.category) !== 0) {
          stillInterested = false;
        }
        if (interested.startDate && new Date(interested.startDate).getTime() > new Date(interview.created).getTime()) {
          stillInterested = false;
        }
        if (interested.endDate && new Date(interview.created).getTime() > new Date(interested.endDate).getTime()) {
          stillInterested = false;
        }
        if (interested.candidate && !interview.candidate.toLowerCase().startsWith(interested.candidate.toLowerCase())) {
          stillInterested = false;
        }

        if (stillInterested) {
          tempInterviews.push(interview);
        }
      });
      return tempInterviews;
    };
  }

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

}());
