'use strict';

describe('Service: todolistService', function () {

  // load the service's module
  beforeEach(module('unitytodoApp'));
  beforeEach(module('stateMock'));

  // instantiate service
  var todolistService, $httpBackend, state;
  beforeEach(inject(function (_todolistService_, _$httpBackend_, $state) {
    todolistService = _todolistService_;
    $httpBackend = _$httpBackend_;
    state = $state;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('finds one todolist from backend', function () {
    $httpBackend.expectGET('/api/todolists/123')
        .respond(200, {_id: 123, title: 'Moi'});

    var result;
    todolistService.findOne(123).then(function(data) {
      result = data;
    });
    $httpBackend.flush();

    expect(result.title).toEqual('Moi');
  });

  it('finds all todolists from backend', function() {
    $httpBackend.expectGET('/api/todolists')
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
    todolistService.findAll().then(function(data) {
      result = data;
    });
    $httpBackend.flush();

    expect(result.length).toEqual(2);
  });

});
