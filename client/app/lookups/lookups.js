angular.module('Wordrly.lookups', [])

.controller('lookups', function($scope, $http, $timeout, words) {
  $scope.currentList = ['Loading'];

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
      user: $scope.current,
      wordObject: {
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

  $timeout(function(){while(!$scope.currentUser) {
    $scope.currentUser = prompt("Please enter a username");
  }}, 500);

  words.loadList().then(function(response) {
    $scope.currentList = response.map(function(wordEntry) {
      return wordEntry.word;
    }).sort();
  });
});