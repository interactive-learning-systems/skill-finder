(function () {
  'use strict';

  angular
    .module('hires.services')
    .factory('HireInterviewInfoService', HireInterviewInfoService)
    .factory('HireInterviewQuestionService', HireInterviewQuestionService);

  HireInterviewInfoService.$inject = ['$resource'];

  function HireInterviewInfoService($resource) {
    return $resource('api/hires/interviewInfo/:hireInterviewId', {
      hireInterviewId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  HireInterviewQuestionService.$inject = ['$resource'];

  function HireInterviewQuestionService($resource) {
    return $resource('api/hires/interviewQuestion/:hireQuestionId', {
      hireQuestionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

}());
