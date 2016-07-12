angular.module('Wordrly.services', [])

.factory('words', function($http) {
  var currentList = {};

  var loadList = function() {
    return $http({
      method: 'GET',
      url: '/api/wordList/list'
    })
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
    return $http({
      method: 'POST',
      url: '/api/wordList/save',
      data: JSON.stringify(data)
    }).then(function(response) {
      return response.data.sort()
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
