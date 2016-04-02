(function () {
  'use strict';

  describe('Trainings Controller Tests', function () {
    // Initialize global variables
    var TrainingsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TrainingsService,
      mockTraining;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TrainingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TrainingsService = _TrainingsService_;

      // create mock training
      mockTraining = new TrainingsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Training about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Trainings controller.
      TrainingsController = $controller('TrainingsController as vm', {
        $scope: $scope,
        trainingResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTrainingPostData;

      beforeEach(function () {
        // Create a sample training object
        sampleTrainingPostData = new TrainingsService({
          title: 'An Training about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.training = sampleTrainingPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TrainingsService) {
        // Set POST response
        $httpBackend.expectPOST('api/trainings', sampleTrainingPostData).respond(mockTraining);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the training was created
        expect($state.go).toHaveBeenCalledWith('trainings.view', {
          trainingId: mockTraining._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/trainings', sampleTrainingPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock training in $scope
        $scope.vm.training = mockTraining;
      });

      it('should update a valid training', inject(function (TrainingsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/trainings\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('trainings.view', {
          trainingId: mockTraining._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (TrainingsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/trainings\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup trainings
        $scope.vm.training = mockTraining;
      });

      it('should delete the training and redirect to trainings', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/trainings\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('trainings.list');
      });

      it('should should not delete the training and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
