'use strict';

angular.module('unitytodoApp')
  .service('todolistService', function ($http) {
    var cb = function(response) {
      return response.data;
    };

    return {
      findOne: function(id) {
        return $http.get('/api/todolists/' + id).then(cb);
      },
      findAll: function() {
        return $http.get('/api/todolists').then(cb);
      },
      create: function(model) {
        return $http.post('/api/todolists', angular.copy(model)).then(cb);
      },
      update: function(model) {
        return $http.put('/api/todolists/' + model._id, angular.copy(model)).then(cb);
      },
      remove: function(id) {
        return $http.delete('/api/todolists/' + id).then(cb);
      }
    };
  });
