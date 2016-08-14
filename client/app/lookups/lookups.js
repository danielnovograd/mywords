angular.module('Wordrly.lookups', [])

.controller('lookups', function($scope, $http, $timeout, words) {
  $scope.currentList = ['Loading...'];

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
<<<<<<< 2bc1ef1682533a68c39796b301a57359f7c47a55
    var wordQuery = $scope.targetWord.toLowerCase();
    if (wordQuery !== $scope.currentWord) {
    words.queryWord(wordQuery)
=======
    var queriedWord = $scope.targetWord.toLowerCase();
    words.queryWord(queriedWord)
>>>>>>> (feat) Convert queries to lowercase
      .then(function(response) {
        $scope.currentWord = wordQuery;
        $scope.wordDefinition = response.data[0];
        $scope.wordEtymology = response.data[1];
        if ($scope.wordDefinition.length > 0 || $scope.wordEtymology.length > 0) {
<<<<<<< 2bc1ef1682533a68c39796b301a57359f7c47a55
          if (!~$scope.lookupList.indexOf(wordQuery)) {
            $scope.lookupList.push(wordQuery);
=======
          if (!~$scope.lookupList.indexOf(queriedWord)) {
            $scope.lookupList.push(queriedWord);
>>>>>>> (feat) Convert queries to lowercase
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
  $scope.changeUser = function() {
    $scope.currentUser = '';
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