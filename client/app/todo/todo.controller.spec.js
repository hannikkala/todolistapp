'use strict';

describe('Controller: TodoCtrl', function () {

  // load the controller's module
  beforeEach(module('unitytodoApp'));
  beforeEach(module('stateMock'));

  var scope;
  var TodoCtrl;
  var state;
  var mockTodoService;
  var createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(todoService, $controller, $rootScope, $state) {
    mockTodoService = todoService;
    scope = $rootScope.$new();
    state = $state;
    createController = function() {
      return $controller('TodoCtrl', {
        $scope: scope,
        $routeParams: {todolistId: 123},
        todoService: mockTodoService,
        _: window._
      });
    };
    TodoCtrl = createController();
  }));

  it('should attach a list of todos to the controller', function() {
    spyOn(mockTodoService, 'findAll').and.callThrough();
    createController();
    expect(mockTodoService.findAll).toHaveBeenCalled();
  });

  it('should call create if _id is not set', function() {
    spyOn(mockTodoService, 'create').and.callFake(function(todolistId, newTodo) {
      newTodo._id = 1231;
      return {
        then: function(cb) {
          cb(newTodo);
        }
      };
    });
    TodoCtrl.newTodo = {
      title: "New Todo"
      ,done: false
    };
    TodoCtrl.saveTodo();
    expect(mockTodoService.create).toHaveBeenCalled();
  });
});
