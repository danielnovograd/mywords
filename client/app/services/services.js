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
