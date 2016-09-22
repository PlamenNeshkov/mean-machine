(function() {
  'use strict';

  angular.module('mainCtrl', [])
    .controller('mainController', function(
        $rootScope, $location, $timeout, Auth) {
      var vm = this;

      vm.loggedIn = Auth.isLoggedIn();

      $rootScope.$on('$routeChangeStart', function() {
        vm.loggedIn = Auth.isLoggedIn();
        Auth.getUser()
          .then(function(response) {
            vm.user = response.data;
          });
      });

      vm.doLogin = function() {
        vm.processing = true;
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
          .then(function(response) {
            if (response.data.success) {
              $location.path('/users');
            } else {
              vm.error = response.data.message;
            }
            vm.processing = false;
          });
      };

      vm.doLogout = function() {
        Auth.logout();
        vm.user = {};
        $location.path('/login');
      };
    });
})();
