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

        if(self.newTodo._id) {
            todoService.update(self.todolistId, self.newTodo).then(function(data) {
                var found = _.find(self.todolists, {_id: data._id});
                if(found) {
                    found.title = data.title;
                    found.done = data.done;
                }
            });
        } else {
            todoService.create(self.todolistId, self.newTodo).then(function(data) {
                self.todos.push(data);
            });
        }

        this.newTodo = null;
      };

      this.deleteTodo = function(todo) {
        todoService.remove(self.todolistId, todo._id).then(function() {
          _.remove(self.todos, {_id: todo._id});
        });
      };

      this.selectTodo = function(todo) {
        self.newTodo = angular.copy(todo);
      };
  });
