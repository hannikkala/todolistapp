'use strict';

describe('Controller: MainController', function() {

  // load the controller's module
  beforeEach(module('unitytodoApp'));
  beforeEach(module('stateMock'));

  var scope;
  var MainController;
  var state;
  var mockTodolistService;
  var createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(todolistService, $controller, $rootScope, $state) {
    mockTodolistService = todolistService;
    scope = $rootScope.$new();
    state = $state;
    createController = function() {
      return $controller('MainController', {
        $scope: scope,
        todoService: mockTodolistService,
        _: window._
      });
    };
    MainController = createController();
  }));

  it('should attach a list of todolists to the controller', function() {
    spyOn(mockTodolistService, 'findAll').and.callThrough();
    createController();
    expect(mockTodolistService.findAll).toHaveBeenCalled();
  });

  it('should call create if newTodolist._id is not set', function() {
    spyOn(mockTodolistService, 'create').and.callFake(function(newTodolist) {
      newTodolist._id = 1231;
      return {
        then: function(cb) {
          cb(newTodolist);
        }
      };
    });
    MainController.newTodolist = {
      title: "New Todolist"
      ,done: false
    };
    MainController.saveTodolist();
    expect(mockTodolistService.create).toHaveBeenCalled();
  });


  it('should call update if newTodolist._id is set', function() {
    spyOn(mockTodolistService, 'update').and.callFake(function(todolist) {
      return {
        then: function(cb) {
          cb(todolist);
        }
      }
    });
    MainController.newTodolist = {
      _id: '123',
      title: 'Todolist 1'
    };
    MainController.saveTodolist();
    expect(mockTodolistService.update).toHaveBeenCalled();
  });

  it('should call remove of the service when removing todo', function() {
    spyOn(mockTodolistService, 'remove').and.callFake(function() {
      return {
        then: function(cb) {
          cb();
        }
      }
    });
    MainController.todolists = [
      {
        _id: 123,
        title: 'test'
      },
      {
        _id: 124,
        title: 'test2'
      }
    ];
    MainController.deleteTodolist({
      _id: 123,
      title: 'test'
    });
    expect(mockTodolistService.remove).toHaveBeenCalled();
    expect(MainController.todolists.length).toEqual(1);
  });

  it('should assign todo when selected', function() {
    var todolist = {
      _id: 123,
      title: 'test'
    };
    MainController.selectTodolist(todolist);
    expect(MainController.newTodolist.title).toEqual(todolist.title);
    expect(MainController.newTodolist._id).toEqual(todolist._id);
    expect(MainController.newTodolist === todolist).toEqual(false);
  });
});
