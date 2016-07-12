var app = angular.module('Wordrly', ['ui.router', 'Wordrly.lookups', 'Wordrly.services']);

app.config([
  '$stateProvider','$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/app/lookups/lookups.html',
        controller: 'lookups'
      });
    $urlRouterProvider.otherwise('home');
  }
]);
