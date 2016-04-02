(function () {
  'use strict';

  describe('Generals Route Tests', function () {
    // Initialize global variables
    var $scope,
      GeneralsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GeneralsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GeneralsService = _GeneralsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('generals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/generals');
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
          liststate = $state.get('generals.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/generals/client/views/list-generals.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          GeneralsController,
          mockGeneral;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('generals.view');
          $templateCache.put('modules/generals/client/views/view-general.client.view.html', '');

          // create mock general
          mockGeneral = new GeneralsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An General about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          GeneralsController = $controller('GeneralsController as vm', {
            $scope: $scope,
            generalResolve: mockGeneral
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:generalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.generalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            generalId: 1
          })).toEqual('/generals/1');
        }));

        it('should attach an general to the controller scope', function () {
          expect($scope.vm.general._id).toBe(mockGeneral._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/generals/client/views/view-general.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GeneralsController,
          mockGeneral;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('generals.create');
          $templateCache.put('modules/generals/client/views/form-general.client.view.html', '');

          // create mock general
          mockGeneral = new GeneralsService();

          // Initialize Controller
          GeneralsController = $controller('GeneralsController as vm', {
            $scope: $scope,
            generalResolve: mockGeneral
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.generalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/generals/create');
        }));

        it('should attach an general to the controller scope', function () {
          expect($scope.vm.general._id).toBe(mockGeneral._id);
          expect($scope.vm.general._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/generals/client/views/form-general.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GeneralsController,
          mockGeneral;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('generals.edit');
          $templateCache.put('modules/generals/client/views/form-general.client.view.html', '');

          // create mock general
          mockGeneral = new GeneralsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An General about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          GeneralsController = $controller('GeneralsController as vm', {
            $scope: $scope,
            generalResolve: mockGeneral
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:generalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.generalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            generalId: 1
          })).toEqual('/generals/1/edit');
        }));

        it('should attach an general to the controller scope', function () {
          expect($scope.vm.general._id).toBe(mockGeneral._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/generals/client/views/form-general.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('generals.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('generals/');
          $rootScope.$digest();

          expect($location.path()).toBe('/generals');
          expect($state.current.templateUrl).toBe('modules/generals/client/views/list-generals.client.view.html');
        }));
      });

    });
  });
}());
