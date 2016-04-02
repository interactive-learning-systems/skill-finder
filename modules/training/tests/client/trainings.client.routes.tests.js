(function () {
  'use strict';

  describe('Trainings Route Tests', function () {
    // Initialize global variables
    var $scope,
      TrainingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TrainingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TrainingsService = _TrainingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('trainings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/trainings');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('trainings.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/trainings/client/views/list-trainings.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TrainingsController,
          mockTraining;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('trainings.view');
          $templateCache.put('modules/trainings/client/views/view-training.client.view.html', '');

          // create mock training
          mockTraining = new TrainingsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Training about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TrainingsController = $controller('TrainingsController as vm', {
            $scope: $scope,
            trainingResolve: mockTraining
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:trainingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.trainingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            trainingId: 1
          })).toEqual('/trainings/1');
        }));

        it('should attach an training to the controller scope', function () {
          expect($scope.vm.training._id).toBe(mockTraining._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/trainings/client/views/view-training.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TrainingsController,
          mockTraining;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('trainings.create');
          $templateCache.put('modules/trainings/client/views/form-training.client.view.html', '');

          // create mock training
          mockTraining = new TrainingsService();

          // Initialize Controller
          TrainingsController = $controller('TrainingsController as vm', {
            $scope: $scope,
            trainingResolve: mockTraining
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.trainingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/trainings/create');
        }));

        it('should attach an training to the controller scope', function () {
          expect($scope.vm.training._id).toBe(mockTraining._id);
          expect($scope.vm.training._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/trainings/client/views/form-training.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TrainingsController,
          mockTraining;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('trainings.edit');
          $templateCache.put('modules/trainings/client/views/form-training.client.view.html', '');

          // create mock training
          mockTraining = new TrainingsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Training about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TrainingsController = $controller('TrainingsController as vm', {
            $scope: $scope,
            trainingResolve: mockTraining
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:trainingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.trainingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            trainingId: 1
          })).toEqual('/trainings/1/edit');
        }));

        it('should attach an training to the controller scope', function () {
          expect($scope.vm.training._id).toBe(mockTraining._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/trainings/client/views/form-training.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('trainings.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('trainings/');
          $rootScope.$digest();

          expect($location.path()).toBe('/trainings');
          expect($state.current.templateUrl).toBe('modules/trainings/client/views/list-trainings.client.view.html');
        }));
      });

    });
  });
}());
