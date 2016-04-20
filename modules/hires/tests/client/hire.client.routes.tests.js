(function () {
  'use strict';

  describe('Hires Route Tests', function () {
    // Initialize global variables
    var $scope,
      HireInterviewInfoService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HireInterviewInfoService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HireInterviewInfoService = _HireInterviewInfoService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('hires');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/hires');
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
          liststate = $state.get('hires.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/hires/client/views/list-hires.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          HiresController,
          mockHire;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('hires.view');
          $templateCache.put('modules/hires/client/views/view-hire.client.view.html', '');

          // create mock hire
          mockHire = new HireInterviewInfoService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Hire about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          HiresController = $controller('HiresController as vm', {
            $scope: $scope,
            hireResolve: mockHire
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:hireId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.hireResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            hireId: 1
          })).toEqual('/hires/1');
        }));

        it('should attach an hire to the controller scope', function () {
          expect($scope.vm.hire._id).toBe(mockHire._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/hires/client/views/view-hire.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HiresController,
          mockHire;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('hires.create');
          $templateCache.put('modules/hires/client/views/form-hire.client.view.html', '');

          // create mock hire
          mockHire = new HireInterviewInfoService();

          // Initialize Controller
          HiresController = $controller('HiresController as vm', {
            $scope: $scope,
            hireResolve: mockHire
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.hireResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/hires/create');
        }));

        it('should attach an hire to the controller scope', function () {
          expect($scope.vm.hire._id).toBe(mockHire._id);
          expect($scope.vm.hire._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/hires/client/views/form-hire.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HiresController,
          mockHire;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('hires.edit');
          $templateCache.put('modules/hires/client/views/form-hire.client.view.html', '');

          // create mock hire
          mockHire = new HireInterviewInfoService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Hire about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          HiresController = $controller('HiresController as vm', {
            $scope: $scope,
            hireResolve: mockHire
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:hireId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.hireResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            hireId: 1
          })).toEqual('/hires/1/edit');
        }));

        it('should attach an hire to the controller scope', function () {
          expect($scope.vm.hire._id).toBe(mockHire._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/hires/client/views/form-hire.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('hires.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('hires/');
          $rootScope.$digest();

          expect($location.path()).toBe('/hires');
          expect($state.current.templateUrl).toBe('modules/hires/client/views/list-hires.client.view.html');
        }));
      });

    });
  });
}());
