angular.module('Wordrly.lookups', [])

.controller('lookups', function($scope, $http, words) {
  $scope.currentList = words.loadList();
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
    words.saveToList(word);
    $scope.currentList = words.loadList();
  };

  $scope.delete = function(word) {
    words.deleteFromList(word);
    $scope.currentList = words.loadList();
  };

  $scope.clearList = function() {
    if (confirm("Are you sure you want to delete?")) {
      words.clearList();
      $scope.currentList = words.loadList();
    }
  };
})

.factory('words', function($http) {
  var currentList = {};

  var loadList = function() {
    var savedList = localStorage.getItem('wordList');
    if (savedList === null) {
      return localStorage.setItem('wordList', JSON.stringify(currentList));
    } else {
      currentList = JSON.parse(savedList);
      return currentList;
    }
  };

  var clearList = function() {
    currentList = {};
    localStorage.setItem('wordList', JSON.stringify(currentList));
    loadList();
  };

  var queryWord = function(word) {
    return $http({
      method: 'POST',
      url: '/api/lookups/query',
      data: JSON.stringify({ data: word })
    });
  };

  var saveToList = function(word) {
    currentList[word] = true;
    localStorage.setItem('wordList', JSON.stringify(currentList));
    return loadList();
  };

  var deleteFromList = function(word) {

    delete currentList[word];
    console.log(currentList);
    localStorage.setItem('wordList', JSON.stringify(currentList));
    return loadList();
  }

  var lookupHistory = [];

  return {
    currentList: currentList,
    loadList: loadList,
    saveToList: saveToList,
    deleteFromList: deleteFromList,
    queryWord: queryWord,
    lookupHistory: lookupHistory,
    clearList: clearList
  };
});