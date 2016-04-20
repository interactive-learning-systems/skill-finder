(function () {
  'use strict';

  angular
  .module('hires.services')
  .factory('Question', Question);

  Question.$inject = ['$http'];

  function Question($http, $q, Question) {
    function question(questionData) {
      this.setData({
        question: {}
      });

      if (questionData) {
        this.setData(questionData);
      }
      // Some other initializations related to questions
    }

    question.prototype = {
      save: function(success, error) {
        return $http.post('api/hires/question/', this);
      },
      setData: function(questionData) {
        angular.extend(this, questionData);
      },
      delete: function() {
        return $http.delete('api/hires/question/' + this._id);
      },
      update: function() {
        return $http.put('api/hires/question/' + this._id, this);
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
    return question;
  }
}());
