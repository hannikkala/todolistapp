'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var todolistCtrlStub = {
  index: 'todolistCtrl.index',
  show: 'todolistCtrl.show',
  create: 'todolistCtrl.create',
  update: 'todolistCtrl.update',
  destroy: 'todolistCtrl.destroy'
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
var todolistIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './todolist.controller': todolistCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Todolist API Router:', function() {

  it('should return an express router instance', function() {
    todolistIndex.should.equal(routerStub);
  });

  describe('GET /api/todolists', function() {

    it('should route to todolist.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'todolistCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/todolists/:id', function() {

    it('should route to todolist.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'todolistCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/todolists', function() {

    it('should route to todolist.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'todolistCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/todolists/:id', function() {

    it('should route to todolist.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'todolistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/todolists/:id', function() {

    it('should route to todolist.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'todolistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/todolists/:id', function() {

    it('should route to todolist.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isAuthenticated', 'todolistCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
