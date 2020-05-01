'use strict';

var app = angular.module('app', ['ngRoute','ngMaterial', 'ngResource','ui.bootstrap.modal']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider,
    $locationProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'www/js/templates/login/login.html',
        controller: 'loginController'
      })
     .when('/signUp', {
        templateUrl: 'www/js/templates/login/signUp.html',
        controller: 'signUpController'
      })
      .when('/dashboard', {
        templateUrl: 'www/js/templates/dashboard/dashboard.html',
        controller: 'dashboardController'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }]);
