(function() {
  'use strict';

  angular.module('userCtrl', ['userService'])
    .controller('userController', function(User) {
      var vm = this;

      vm.processing = true;

      User.all()
        .then(function(response) {
          vm.processing = false;
          vm.users = response.data;
        });

      vm.deleteUser = function(id) {
        vm.processing = true;
        User.delete(id)
          .then(function(response) {
            User.all()
              .then(function(response) {
                vm.processing = false;
                vm.users = response.data;
              });
          });
      };
    })
    .controller('userCreateController', function(User) {
      var vm = this;

      vm.type = 'create';

      vm.saveUser = function() {
        vm.processing = true;
        vm.message = '';

        User.create(vm.userData)
          .then(function(response) {
            vm.processing = false;
            vm.userData = {};
            vm.message = response.data.message;
          });
      };
    })
    .controller('userEditController', function($routeParams, User) {
      var vm = this;

      vm.type = 'edit';

      User.get($routeParams.user_id)
        .then(function(response) {
          vm.userData = response.data;
        });

      vm.saveUser = function() {
        vm.processing = true;
        vm.message = '';

        User.update($routeParams.user_id, vm.userData)
          .then(function(response) {
            vm.processing = false;
            vm.userData = {};
            vm.message = response.data.message;
          });
      };
    });
})();
