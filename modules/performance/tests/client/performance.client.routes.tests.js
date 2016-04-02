(function () {
  'use strict';

  describe('Performances Route Tests', function () {
    // Initialize global variables
    var $scope,
      PerformancesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PerformancesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PerformancesService = _PerformancesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('performances');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/performances');
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
          liststate = $state.get('performances.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/performances/client/views/list-performances.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PerformancesController,
          mockPerformance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('performances.view');
          $templateCache.put('modules/performances/client/views/view-performance.client.view.html', '');

          // create mock performance
          mockPerformance = new PerformancesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Performance about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          PerformancesController = $controller('PerformancesController as vm', {
            $scope: $scope,
            performanceResolve: mockPerformance
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:performanceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.performanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            performanceId: 1
          })).toEqual('/performances/1');
        }));

        it('should attach an performance to the controller scope', function () {
          expect($scope.vm.performance._id).toBe(mockPerformance._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/performances/client/views/view-performance.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PerformancesController,
          mockPerformance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('performances.create');
          $templateCache.put('modules/performances/client/views/form-performance.client.view.html', '');

          // create mock performance
          mockPerformance = new PerformancesService();

          // Initialize Controller
          PerformancesController = $controller('PerformancesController as vm', {
            $scope: $scope,
            performanceResolve: mockPerformance
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.performanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/performances/create');
        }));

        it('should attach an performance to the controller scope', function () {
          expect($scope.vm.performance._id).toBe(mockPerformance._id);
          expect($scope.vm.performance._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/performances/client/views/form-performance.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PerformancesController,
          mockPerformance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('performances.edit');
          $templateCache.put('modules/performances/client/views/form-performance.client.view.html', '');

          // create mock performance
          mockPerformance = new PerformancesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Performance about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          PerformancesController = $controller('PerformancesController as vm', {
            $scope: $scope,
            performanceResolve: mockPerformance
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:performanceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.performanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            performanceId: 1
          })).toEqual('/performances/1/edit');
        }));

        it('should attach an performance to the controller scope', function () {
          expect($scope.vm.performance._id).toBe(mockPerformance._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/performances/client/views/form-performance.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('performances.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('performances/');
          $rootScope.$digest();

          expect($location.path()).toBe('/performances');
          expect($state.current.templateUrl).toBe('modules/performances/client/views/list-performances.client.view.html');
        }));
      });

    });
  });
}());
