angular.module('Wordrly.services', [])

.factory('words', function($http) {
  var currentList = {};
  var defaultUser = 'dan'
  var loadList = function() {
    return $http({
      method: 'POST',
      url: '/api/wordList/list',
      data: {
        user: defaultUser
      }
    })
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
      console.log(error);
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
    delete currentList[word];
    localStorage.setItem('wordList', JSON.stringify(currentList));
    return loadList();
  }

  var saveToList = function(data) {
    return $http({
      method: 'POST',
      url: '/api/wordList/save',
      data: JSON.stringify(data)
    }).then(function(response) {
      return response.data.sort();
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
    saveToList: saveToList
  };
});
