(function () {
  'use strict';

  angular
  .module('hires.services')
  .factory('Interview', Interview);

  Interview.$inject = ['$http', 'QuestionManager'];

  function Interview($http, QuestionManager, $q, Interview) {
    function interview(interviewData) {
      var a = this;
      QuestionManager.loadAllQuestions().then(function(questionTemplates) {
        a.setData({
          interviewer: "",
          candidate: "",
          location: "",
          category: "",
          questions: QuestionManager.questionsFromTemplates(questionTemplates)
        });
        if (interviewData) {
          a.setData(interviewData);
        }
      });
    }

    interview.prototype = {
      save: function(success, error) {
        return $http.post('api/hires/interview/', this);
      },
      setData: function(interviewData) {
        angular.extend(this, interviewData);
      },
      setQuestions: function(questionData) {
        angular.extend(this.questions, questionData);
      },
      delete: function() {
        return $http.delete('api/hires/interview/' + this._id);
      },
      update: function() {
        return $http.put('api/hires/interview/' + this._id, this);
      },
      saveOrUpdate: function(successCallback, errorCallback) {
        if (this._id) {
          return this.update(successCallback, errorCallback);
        } else {
          return this.save(successCallback, errorCallback);
        }
      },
      isAvailable: function() {
        if (!this.stores || this.stores.length === 0) {
          return false;
        }
        return this.stores.some(function(store) {
          return store.quantity > 0;
        });
      }
    };
    return interview;
  }
}());
