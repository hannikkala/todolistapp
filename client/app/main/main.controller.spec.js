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
});
