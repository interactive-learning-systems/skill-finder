(function () {
  'use strict';

  angular
  .module('hires.services')
  .factory('InterviewManager', InterviewManager);

  InterviewManager.$inject = ['$http', '$q', 'Interview'];

  function InterviewManager($http, $q, Interview) {
    var interviewManager = {
      _currentInterviewId: null,
      _pool: {},
      _setInstance: function(interview) {
        this._pool[interview._id] = interview;
      },
      _retrieveInstance: function(interviewId, interviewData) {
        this._currentInterviewId = interviewId;
        var instance = this._pool[interviewId];

        if (instance) {
          instance.setData(interviewData);
        } else {
          instance = new Interview(interviewData);
          this._pool[interviewId] = instance;
        }

        return instance;
      },
      _search: function(interviewId) {
        return this._pool[interviewId];
      },
      _load: function(interviewId, deferred) {
        var scope = this;

        $http.get('api/hires/interview/' + interviewId)
        .success(function(interviewData) {
          var interview = scope._retrieveInstance(interviewData._id, interviewData);
          deferred.resolve(interview);
        })
        .error(function() {
          deferred.reject();
        });
      },
      /* Public Methods */
      /* Use this function in order to get a interview instance by it's id */
      getInterview: function(interviewId) {
        var deferred = $q.defer();
        var interview = this._search(interviewId);
        if (interview) {
          deferred.resolve(interview);
        } else {
          this._load(interviewId, deferred);
        }
        return deferred.promise;
      },
      /* Use this function in order to get instances of all the interviews */
      loadAllInterviews: function() {
        var deferred = $q.defer();
        var scope = this;
        $http.get('api/hires/interview')
        .success(function(interviewsArray) {
          var interviews = [];
          interviewsArray.forEach(function(interviewData) {
            var interview = scope._retrieveInstance(interviewData._id, interviewData);
            interviews.push(interview);
          });

          deferred.resolve(interviews);
        })
        .error(function() {
          deferred.reject();
        });
        return deferred.promise;
      },
      /*  This function is useful when we got somehow the interview data and we wish to store it or update the pool and get a interview instance in return */
      setInterview: function(interviewData) {
        var scope = this;
        var interview = this._search(interviewData._id);
        if (interview) {
          interview.setData(interviewData);
        } else {
          interview = scope._retrieveInstance(interviewData._id, interviewData);
        }
        return interview;
      },
      clearCurrentInterview: function() {
        this._currentInterviewId = null;
      },
      retrieveCurrentInterview: function() {
        return this._retrieveInstance(this._currentInterviewId);
      },
      setCurrentInterview: function(interview) {
        this._currentInterviewId = interview._id;
        this._setInstance(interview);
      }
    };
    return interviewManager;
  }
}());
