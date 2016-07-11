angular.module('Wordrly.services', [])

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
    localStorage.setItem('wordList', JSON.stringify(currentList));
    return loadList();
  }

  var saveToDB = function(data) {
    console.log("SERVICE DATA: ", data);
    return $http({
      method: 'POST',
      url: '/api/wordList/save',
      data: JSON.stringify(data)
    }).then(function(response) {
      return response.data.map(function(word) {
        return [word.word, word.definition, word.etymology];
      });
    }).catch(function(err) {
      console.log(err);
    })
  }

  var lookupHistory = [];

  return {
    currentList: currentList,
    loadList: loadList,
    saveToList: saveToList,
    deleteFromList: deleteFromList,
    queryWord: queryWord,
    lookupHistory: lookupHistory,
    clearList: clearList,
    saveToDB: saveToDB
  };
});
