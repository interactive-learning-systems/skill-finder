(function () {
  'use strict';

  angular
  .module('hires.services')
  .factory('QuestionManager', QuestionManager);

  QuestionManager.$inject = ['$http', '$q', 'Question'];

  function QuestionManager($http, $q, Question) {
    var questionsManager = {
      _currentQuestionsId: null,
      _pool: {},
      _setInstance: function(questions) {
        this._pool[questions._id] = questions;
      },
      _retrieveInstance: function(questionsId, questionsData) {
        this._currentQuestionsId = questionsId;
        var instance = this._pool[questionsId];

        if (instance) {
          instance.setData(questionsData);
        } else {
          instance = new Question(questionsData);
          this._pool[questionsId] = instance;
        }

        return instance;
      },
      _search: function(questionsId) {
        return this._pool[questionsId];
      },
      _load: function(questionsId, deferred) {
        var scope = this;

        $http.get('api/hires/question/' + questionsId)
        .success(function(questionsData) {
          var questions = scope._retrieveInstance(questionsData._id, questionsData);
          deferred.resolve(questions);
        })
        .error(function() {
          deferred.reject();
        });
      },
      /* Public Methods */
      /* Use this function in order to get a questions instance by it's id */
      getQuestions: function(questionsId) {
        var deferred = $q.defer();
        var questions = this._search(questionsId);
        if (questions) {
          deferred.resolve(questions);
        } else {
          this._load(questionsId, deferred);
        }
        return deferred.promise;
      },
      /* Use this function in order to get instances of all the questionss */
      loadAllQuestions: function() {
        var deferred = $q.defer();
        var scope = this;
        $http.get('api/hires/question')
        .success(function(questionssArray) {
          var questionss = [];
          questionssArray.forEach(function(questionsData) {
            var questions = scope._retrieveInstance(questionsData._id, questionsData);
            questionss.push(questions);
          });

          deferred.resolve(questionss);
        })
        .error(function() {
          deferred.reject();
        });
        return deferred.promise;
      },
      /*  This function is useful when we got somehow the questions data and we wish to store it or update the pool and get a questions instance in return */
      setQuestions: function(questionsData) {
        var scope = this;
        var questions = this._search(questionsData._id);
        if (questions) {
          questions.setData(questionsData);
        } else {
          questions = scope._retrieveInstance(questionsData._id, questionsData);
        }
        return questions;
      },
      clearCurrentQuestions: function() {
        this._currentQuestionsId = null;
      },
      retrieveCurrentQuestions: function() {
        return this._retrieveInstance(this._currentQuestionsId);
      },
      setCurrentQuestions: function(questions) {
        this._currentQuestionsId = questions._id;
        this._setInstance(questions);
      },
      questionsFromTemplates: function(questionTemplates) {
        var questions = [];
        for (var i = 0; i < questionTemplates.length; i++) {
          var qt = questionTemplates[i];
          var question = {
            question: qt.question, hint: qt.hint,
            module: qt.module, unit: qt.unit, chapter: qt.chapter, section: qt.section,
            rating: qt.rating
          };
          questions.push(question);
        }
        return questions;
      }
    };
    return questionsManager;
  }
}());
