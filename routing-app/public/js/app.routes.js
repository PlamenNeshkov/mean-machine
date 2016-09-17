(function() {
  'use strict';

  var app = angular.module('routerRoutes', ['ngRoute']);

  app.config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/views/pages/home.html',
        controller: 'homeCtrl',
        controllerAs: 'home'
      })
      .when('/about', {
        templateUrl: '/views/pages/about.html',
        controller: 'aboutCtrl',
        controllerAs: 'about'
      })
      .when('/contact', {
        templateUrl: '/views/pages/contact.html',
        controller: 'contactCtrl',
        controllerAs: 'contact'
      });

    $locationProvider.html5Mode(true);
  });
})();
