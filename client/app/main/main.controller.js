'use strict';
(function() {

function MainController($scope, todolistService, _) {
  var self = this;
  this.todolists = [];

  todolistService.findAll().then(function(todos) {
    self.todolists = todos;
  });

  $scope.saveTodolist = function() {
    if (!$scope.newTodolist || $scope.newTodolist.title === '') {
      return;
    }
    if(!$scope.newTodolist._id) {
      todolistService.create($scope.newTodolist).then(function(data) {
        self.todolists.push(data);
      });
    } else {
      todolistService.update($scope.newTodolist).then(function(data) {
        var found = _.find(self.todolists, {_id: data._id});
        if(found) {
          found.title = data.title;
        }
      });
    }
    $scope.newTodolist = null;
  };

  $scope.deleteTodolist = function(todolist) {
    todolistService.remove(todolist._id).then(function() {
      _.remove(self.todolists, {_id: todolist._id});
    });
  };

  $scope.selectTodolist = function(todolist) {
    $scope.newTodolist = angular.copy(todolist);
  };
}

angular.module('unitytodoApp')
  .controller('MainController', MainController);

})();
