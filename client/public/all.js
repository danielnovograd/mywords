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

.controller('lookups', function($scope, $http, $timeout, words) {
  $scope.currentList = ['Loading'];

  $scope.showLookups = false;
  $scope.lookupList = words.lookupHistory;
  $scope.targetWord = '';
  $scope.currentWord = '';
  $scope.selected = {
    definitions: [],
    etymologies: []
  };
  $scope.selectDefProperty = function(def) {
    var defString = "(" + def.partOfSpeech + ") -- " + def.text;
    if (!~$scope.selected.definitions.indexOf(defString)) {
      $scope.selected.definitions.push(defString);
    }
    else {
      $scope.selected.definitions.splice($scope.selected.definitions.indexOf(defString), 1);
    }
  };
  //input text search
  $scope.queryWord = function() {
    var wordQuery = $scope.targetWord.toLowerCase();
    if (wordQuery !== $scope.currentWord) {
    words.queryWord(wordQuery)
      .then(function(response) {
        $scope.currentWord = wordQuery;
        $scope.wordDefinition = response.data[0];
        $scope.wordEtymology = response.data[1];
        if ($scope.wordDefinition.length > 0 || $scope.wordEtymology.length > 0) {
          if (!~$scope.lookupList.indexOf(wordQuery)) {
            $scope.lookupList.push(wordQuery);
          }
        }
        $scope.showLookups = true;
      });
    }
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
      user: $scope.currentUser,
      wordObject: {
        word: word,
        definition: $scope.selected.definitions || $scope.wordDefinition.map(function(word) {
          return word.text; }),
        etymology: $scope.wordEtymology.map(function(entry) {
          return entry.etymology;
        })
      }
    }).then(function(response) {
      $scope.currentList = response.map(function(wordEntry) {
        return wordEntry.word;
      }).sort();
      $scope.selected.definition = [];
    });
  };

  $scope.delete = function(word) {
    words.deleteFromList({
      user: $scope.currentUser,
      word: word
    }).then(function(response) {
      $scope.currentList = response.map(function(wordEntry) {
        return wordEntry.word;
      }).sort();
    });
  };

  $scope.clearList = function() {
    if (confirm("Are you sure you want to delete?")) {
      $scope.currentList = words.clearList($scope.currentUser);
    }
  };

  $timeout(function(){
    while(!$scope.currentUser) {
      $scope.currentUser = prompt("Please enter a username");
    }
    words.loadList($scope.currentUser)
    .then(function(response) {
      if (response.length > 0) {
        $scope.currentList = response.map(function(wordEntry) {
          return wordEntry.word;
        }).sort();
      }
      else {
        $scope.currentList = [];
      }
    });
  }, 400);
});
angular.module('Wordrly.services', [])

.factory('words', function($http) {
  var currentList = {};
  var loadList = function(currentUser) {
    return $http({
      method: 'POST',
      url: '/api/wordList/list',
      data: JSON.stringify({
        username: currentUser
      })
    }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.log("loadList error: ", error);
    });
  };


  var queryWord = function(word) {
    return $http({
      method: 'POST',
      url: '/api/lookups/query',
      data: JSON.stringify({
        wordQuery: word
      })
    });
  };

  var deleteFromList = function(data) {
    return $http({
      method: 'POST',
      url: '/api/wordList/delete',
      data: JSON.stringify({
        username: data.user,
        word: data.word
      })
    }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.log("deleteFromList Error: ", error);
    });
  };

  var clearList = function(currentUser) {
    return $http({
      method: 'POST',
      url: '/api/wordList/clear',
      data: JSON.stringify({
        username: currentUser
      })
    }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.log("clearList Error: ", error);
    });
  };


  var saveToList = function(data) {
    return $http({
      method: 'POST',
      url: '/api/wordList/save',
      data: JSON.stringify({
        username: data.user,
        word: data.wordObject
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
