'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var todoCtrlStub = {
  index: 'todoCtrl.index',
  show: 'todoCtrl.show',
  create: 'todoCtrl.create',
  update: 'todoCtrl.update',
  destroy: 'todoCtrl.destroy'
};

var authServiceStub = {
  isAuthenticated: function() {
    return 'authService.isAuthenticated';
  },
  hasRole: function(role) {
    return 'authService.hasRole.' + role;
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var todoIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './todo.controller': todoCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Todo API Router:', function() {

  it('should return an express router instance', function() {
    todoIndex.should.equal(routerStub);
  });

  describe('GET /api/todos', function() {

    it('should route to todo.controller.index', function() {
      routerStub.get
        .withArgs('/:todolistId/todos/', 'authService.isAuthenticated', 'todoCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/:todolistId/todos/:id', function() {

    it('should route to todo.controller.show', function() {
      routerStub.get
        .withArgs('/:todolistId/todos/:id', 'authService.isAuthenticated', 'todoCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/todos', function() {

    it('should route to todo.controller.create', function() {
      routerStub.post
        .withArgs('/:todolistId/todos/', 'authService.isAuthenticated', 'todoCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/todos/:id', function() {

    it('should route to todo.controller.update', function() {
      routerStub.put
        .withArgs('/:todolistId/todos/:id', 'authService.isAuthenticated', 'todoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/todos/:id', function() {

    it('should route to todo.controller.update', function() {
      routerStub.patch
        .withArgs('/:todolistId/todos/:id', 'authService.isAuthenticated', 'todoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/todos/:id', function() {

    it('should route to todo.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:todolistId/todos/:id', 'authService.isAuthenticated', 'todoCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
