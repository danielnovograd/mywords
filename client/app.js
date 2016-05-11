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

        //input text search
        $scope.queryWord = function() {
          words.queryWord($scope.targetWord)
          .then(function(response){
            $scope.wordDefinition = response.data[0];
            $scope.wordEtymology = response.data[1];
            if ($scope.wordDefinition.length > 0 || $scope.wordEtymology.length > 0) {
                $scope.lookupList.push($scope.targetWord);    
            }
            $scope.showLookups = true;
          })
        };

        //redo past query
        $scope.pastLookup = function(word) {
            words.queryWord(word)
            .then(function(response){
            $scope.showLookups = true;
            $scope.wordDefinition = response.data[0];
            $scope.wordEtymology = response.data[1][0];
        })
        }
        $scope.targetWord = '';

    });

app.factory('words', function($http) {
    var queryWord = function(word) {
        return $http({
            method: 'POST',
            url: '/api/lookups/query',
            data: JSON.stringify({data: word})
        });
    };
    var lookupHistory = [];
    return {
        queryWord: queryWord,
        lookupHistory: lookupHistory
    };
});
