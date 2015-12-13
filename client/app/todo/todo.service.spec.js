'use strict';

describe('Service: todoService', function () {
  // load the service's module
  beforeEach(module('unitytodoApp'));
  beforeEach(module('stateMock'));

  // instantiate service
  var todoService, $httpBackend, state;
  beforeEach(inject(function (_todoService_, _$httpBackend_, $state) {
    todoService = _todoService_;
    $httpBackend = _$httpBackend_;
    state = $state;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('finds one todo from backend', function () {
    $httpBackend.expectGET('/api/todolists/123/todos/124')
      .respond(200, {_id: 123, title: 'Moi'});

    var result;
    todoService.findOne(123, 124).then(function(data) {
      result = data;
    });
    $httpBackend.flush();

    expect(result.title).toEqual('Moi');
  });

  it('finds all todos from backend', function() {
    $httpBackend.expectGET('/api/todolists/123/todos')
      .respond(200, [
          {
            _id: 123,
            title: '123'
          },{
            _id: 124,
            title: '124'
          }
        ]);
    var result;
    todoService.findAll(123).then(function(data) {
      result = data;
    });
    $httpBackend.flush();

    expect(result.length).toEqual(2);
  });

});
