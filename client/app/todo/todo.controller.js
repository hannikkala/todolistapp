'use strict';

angular.module('unitytodoApp')
  .controller('TodoCtrl', function ($scope, $stateParams, todoService, _) {
      this.todos = [];
      this.todolistId = $stateParams.todolistId;
      var self = this;

      todoService.findAll(this.todolistId).then(function(todos) {
        self.todos = todos;
      });

      this.saveTodo = function() {
        if (!self.newTodo || self.newTodo.title === '') {
          return;
        }
        if(!self.newTodo._id) {
          todoService.create(self.todolistId, self.newTodo).then(function(data) {
            self.todos.push(data);
          });
        } else {
          todoService.update(self.todolistId, self.newTodo).then(function(data) {
            var found = _.find(self.todos, {_id: data._id});
            if(found) {
              found.title = data.title;
            }
          });
        }
        this.newTodo = null;
      };

      this.deleteTodo = function(todo) {
        todolistService.remove(todo._id).then(function() {
          _.remove(self.todolists, {_id: todo._id});
        });
      };
  });
