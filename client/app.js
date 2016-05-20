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
        $scope.currentList = words.currentList;

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
        $scope.save = function(word) {
            words.saveToList(word);
        };
        $scope.clearList = function() {
            if(confirm("Are you sure you want to delete?")) {
                words.clearList();
            };
        }
    });

app.factory('words', function($http) {
    var currentList = {};

    var loadList = function() {
        var savedList = localStorage.getItem('wordList');
        if (savedList === null) {
            localStorage.setItem('wordList', JSON.stringify(currentList));
        }
        else {
            currentList = JSON.parse(savedList);
        }
    };

    var clearList = function() {
        currentList = {};
        localStorage.setItem('wordList', JSON.stringify(currentList));
    };

    var queryWord = function(word) {
        return $http({
            method: 'POST',
            url: '/api/lookups/query',
            data: JSON.stringify({data: word})
        });
    };

    var saveToList = function(word) {
        currentList[word] = true;
        localStorage.setItem('wordList', JSON.stringify(currentList));
        loadList();
        console.log("WORD LIST", JSON.parse(localStorage.getItem('wordList')));
    };

    var localList = loadList();
    var lookupHistory = [];

    return {
        currentList: currentList,
        loadList: loadList,
        saveToList: saveToList,
        queryWord: queryWord,
        localList: localList,
        lookupHistory: lookupHistory,
        clearList: clearList
    };
});
