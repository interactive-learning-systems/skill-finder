(function () {
  'use strict';
  console.log("ASDF");

  angular.module('core')
    .directive('ngIndeterminate', ngIndeterminate);

  ngIndeterminate.$inject = ['$compile'];

  function ngIndeterminate($compile) {
    var directive = {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$watch(attributes.ngIndeterminate, function (value) {
          element.prop('indeterminate', !!value);
        });
      }
    };

    return directive;
  }
}());
