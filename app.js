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
    function($scope, $http, words) {
        $scope.showLookups = false;
        $scope.lookupList = words.lookupHistory;
        $scope.test = 'TESTING TESTING';
        $scope.queryWord = function() {
          $http({
            method: 'POST',
            url: '/api/word',
            data: JSON.stringify({data: $scope.targetWord})
          }).then(function(response){
            $scope.showLookups = true;
            $scope.wordDefinition = response.data[0];
            $scope.wordEtymology = response.data[1][0];
            $scope.lookupList.push($scope.targetWord);
          })
        };
        $scope.targetWord = '';

    });

app.factory('words', [function() {
    var o = {
        lookupHistory: []

    };
    return o;
}])
