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

angular.module('Wordrly.lookups', [])

.controller('lookups', function($scope, $http, words) {
  $scope.currentList = ['Loading'];

  words.loadList().then(function(response) {
    $scope.currentList = response.map(function(wordEntry) {
      return wordEntry.word;
    }).sort();
  });

  $scope.showLookups = false;
  $scope.lookupList = words.lookupHistory;
  $scope.targetWord = '';
  $scope.currentWord = '';

  //input text search
  $scope.queryWord = function() {
    words.queryWord($scope.targetWord)
      .then(function(response) {
        $scope.currentWord = $scope.targetWord;
        $scope.wordDefinition = response.data[0];
        $scope.wordEtymology = response.data[1];
        if ($scope.wordDefinition.length > 0 || $scope.wordEtymology.length > 0) {
          if (!~$scope.lookupList.indexOf($scope.targetWord)) {
            $scope.lookupList.push($scope.targetWord);
          }
        }
        $scope.showLookups = true;
      });
  };

  //redo past query
  $scope.pastLookup = function(word) {
    words.queryWord(word)
      .then(function(response) {
        $scope.showLookups = true;
        $scope.currentWord = word;
        $scope.wordDefinition = response.data[0];
        $scope.wordEtymology = response.data[1];
      });
  };

  $scope.save = function(word) {
    words.saveToList({
      word: word,
      definition: $scope.wordDefinition.map(function(word) {
        return word.text; }),
      etymology: $scope.wordEtymology.map(function(entry) {
        return entry.etymology;
      })
    }).then(function(response) {
      $scope.currentList = response.map(function(wordEntry) {
        return wordEntry.word;
      }).sort();
    });
  };

  $scope.delete = function(word) {
    words.deleteFromList(word).then(function(response) {
      $scope.currentList = response.map(function(wordEntry) {
        return wordEntry.word;
      }).sort();
    });
  };

  $scope.clearList = function() {
    if (confirm("Are you sure you want to delete?")) {
      $scope.currentList = words.clearList();
    }
  };
});
angular.module('Wordrly.services', [])

.factory('words', function($http) {
  var currentList = {};
  var defaultUser = 'dan';
  var loadList = function() {
    return $http({
      method: 'POST',
      url: '/api/wordList/list',
      data: {
        user: defaultUser
      }
    }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.log("loadList Error: ", error);
    });
  };

  var clearList = function() {
    return $http({
      method: 'POST',
      url: '/api/wordList/clear',
      data: JSON.stringify({
        user: defaultUser
      })
    }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.log("clearList Error: ", error);
    });
  };

  var queryWord = function(word) {
    return $http({
      method: 'POST',
      url: '/api/lookups/query',
      data: JSON.stringify({
        user: defaultUser,
        data: word
      })
    });
  };

  var deleteFromList = function(word) {
    return $http({
      method: 'POST',
      url: '/api/wordList/delete',
      data: JSON.stringify({
        word: word,
        user: defaultUser
      })
    }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.log("deleteFromList Error: ", error);
    });
  };

  var saveToList = function(data) {
    return $http({
      method: 'POST',
      url: '/api/wordList/save',
      data: JSON.stringify({
        user: defaultUser,
        word: data
      })
    }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.log("saveToList Error: ", error);
    });
  };

  var lookupHistory = [];

  return {
    currentList: currentList,
    loadList: loadList,
    deleteFromList: deleteFromList,
    queryWord: queryWord,
    lookupHistory: lookupHistory,
    clearList: clearList,
    saveToList: saveToList
  };
});
