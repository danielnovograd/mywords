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
            if (!$scope.targetWord || $scope.targetWord === '') {
                return;
            }
            if ($scope.lookupHistory.indexOf($scope.targetWord) < 0) {
                //lookup word def
                //lookup word etym
                $q.all({
                    definitionArray: $http.get('http://api.wordnik.com:80/v4/word.json/' + $scope.targetWord + '/definitions?limit=5&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'),
                    etymology: $http.get('http://api.wordnik.com:80/v4/word.json/' + $scope.targetWord + '/etymologies?useCanonical=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
                }).then(function(results) {
                    $scope.wordDefinition = results.definitionArray.data[0].text;
                    $scope.wordEtymology = results.etymology.data[0];
                    $scope.lookupHistory.push($scope.targetWord);
                    $scope.lookupList = $scope.lookupHistory.join(", ");
                    $scope.showLookups = true;
                })

            }
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
