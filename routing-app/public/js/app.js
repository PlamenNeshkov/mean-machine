(function() {
  'use strict';

  var app = angular.module('routerApp', ['routerRoutes']);

  app.controller('mainCtrl', function() {
    var vm = this;
    vm.bigMessage = 'A smooth sea never made a skilled sailor.';
  });

  app.controller('homeCtrl', function() {
    var vm = this;
    vm.message = 'This is the homepage!';
  });

  app.controller('aboutCtrl', function() {
    var vm = this;
    vm.message = 'Look! I am an about page.';
  });

  app.controller('contactCtrl', function() {
    var vm = this;
    vm.message = 'Contact us! JK, just a demo.';
  });
})();
