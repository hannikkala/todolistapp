'use strict';

angular.module('unitytodoApp')
  .factory('todoService', function ($http) {
    var cb = function(response) {
      return response.data;
    };

    return {
      findOne: function(todolistId, id) {
        return $http.get('/api/todolists/' + todolistId + '/todos/' + id).then(cb);
      },
      findAll: function(todolistId) {
        return $http.get('/api/todolists/' + todolistId + '/todos').then(cb);
      },
      create: function(todolistId, model) {
        return $http.post('/api/todolists/' + todolistId + '/todos', angular.copy(model)).then(cb);
      },
      update: function(todolistId, model) {
        return $http.put('/api/todolists/' + todolistId + '/todos/' + model._id, angular.copy(model)).then(cb);
      },
      remove: function(todolistId, id) {
        return $http.delete('/api/todolists/' + todolistId + '/todos/' + id).then(cb);
      }
    };
  });
