var app = angular.module('myWord', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.controller('MainCtrl',
    function($scope, $q, $http, words) {
        $scope.showLookups = false;
        $scope.test = 'TESTING TESTING';
        $scope.queryWord = function() {
          $http({
            method: 'POST',
            url: '/api/word',
            data: JSON.stringify({data: $scope.targetWord})
          }).then(function(response){
            console.log(response);
          })
        };
        $scope.targetWord = '';
        $scope.lookupHistory = words.lookupHistory;
    });

app.factory('words', [function() {
    var o = {
        lookupHistory: []

    };
    return o;
}])
