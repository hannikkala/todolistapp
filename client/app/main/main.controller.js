'use strict';
(function() {

function MainController($scope, todolistService, _) {
  var self = this;
  this.todolists = [];

  todolistService.findAll().then(function(todos) {
    self.todolists = todos;
  });

  this.saveTodolist = function() {
    if (!self.newTodolist || self.newTodolist.title === '') {
      return;
    }
    if(!self.newTodolist._id) {
      todolistService.create(self.newTodolist).then(function(data) {
        self.todolists.push(data);
      });
    } else {
      todolistService.update(self.newTodolist).then(function(data) {
        var found = _.find(self.todolists, {_id: data._id});
        if(found) {
          found.title = data.title;
        }
      });
    }
    self.newTodolist = null;
  };

  this.deleteTodolist = function(todolist) {
    todolistService.remove(todolist._id).then(function() {
      _.remove(self.todolists, {_id: todolist._id});
    });
  };

  this.selectTodolist = function(todolist) {
    self.newTodolist = angular.copy(todolist);
  };
}

angular.module('unitytodoApp')
  .controller('MainController', MainController);

})();
