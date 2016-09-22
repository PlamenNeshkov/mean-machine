(function() {
  'use strict';

  angular.module('authService', [])
    .factory('Auth', function($http, $q, AuthToken) {
      var authFactory = {};

      authFactory.login = function(username, password) {
        return $http.post('/api/authenticate', {
          username: username,
          password: password
        })
          .then(function(response) {
            AuthToken.set(response.data.token);
            return response;
          });
      };

      authFactory.logout = function() {
        AuthToken.set();
      };

      authFactory.isLoggedIn = function() {
        if (AuthToken.get()) {
          return true;
        }
        return false;
      };

      authFactory.getUser = function() {
        if (AuthToken.get()) {
          return $http.get('/api/me', {cache: true});
        }
        return $q.reject({message: 'User has no token.'});
      };

      return authFactory;
    })
    .factory('AuthToken', function($window) {
      var authTokenFactory = {};

      authTokenFactory.get = function() {
        return $window.localStorage.getItem('token');
      };

      authTokenFactory.set = function(token) {
        if (token) {
          $window.localStorage.setItem('token', token);
        } else {
          $window.localStorage.removeItem('token');
        }
      };

      return authTokenFactory;
    })
    .factory('AuthInterceptor', function($q, $location, AuthToken) {
      var interceptorFactory = {};

      interceptorFactory.request = function(config) {
        var token = AuthToken.get();
        if (token) {
          config.headers['x-access-token'] = token;
        }
        return config;
      };

      interceptorFactory.responseError = function(response) {
        if (response.status === 403) {
          AuthToken.set();
          $location.path('/login');
        }
        return $q.reject(response);
      };

      return interceptorFactory;
    });
})();
