'use strict';

var app = require('../..');
var request = require('supertest');
var User = require('../user/user.model');
var Todolist = require('../todolist/todolist.model');

var newTodo;

describe('Todo API:', function() {
  var user, token, todolist;

  // Clear users before testing
  before(function() {
    return User.removeAsync().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.saveAsync();
    });
  });

  before(function() {
    return Todolist.removeAsync().then(function() {
      todolist = new Todolist({
        title: 'Test todolist',
        user: user
      });

      return todolist.saveAsync();
    });
  });

  beforeEach(function(done) {
    request(app)
        .post('/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          token = res.body.token;
          done();
        });
  });

  // Clear users after testing
  after(function() {
    return User.removeAsync();
  });

  describe('GET /api/:todolistId/todos', function() {
    var todos;

    beforeEach(function(done) {
      request(app)
        .get('/api/' + todolist._id + '/todos')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          todos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      todos.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/:todolistId/todos', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/' + todolist._id + '/todos')
        .set('authorization', 'Bearer ' + token)
        .send({
          title: 'New Todo',
          done: false
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newTodo = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', function() {
      newTodo.title.should.equal('New Todo');
      newTodo.done.should.equal(false);
    });

  });

  describe('GET /api/:todolistId/todos/:id', function() {
    var todo;

    beforeEach(function(done) {
      request(app)
        .get('/api/' + todolist._id + '/todos/' + newTodo._id)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          todo = res.body;
          done();
        });
    });

    afterEach(function() {
      todo = {};
    });

    it('should respond with the requested todo', function() {
      todo.title.should.equal('New Todo');
      todo.done.should.equal(false);
    });

  });

  describe('PUT /api/:todolistId/todos/:id', function() {
    var updatedTodo;

    beforeEach(function(done) {
      request(app)
        .put('/api/' + todolist._id + '/todos/' + newTodo._id)
        .set('authorization', 'Bearer ' + token)
        .send({
          title: 'Updated Todo',
          done: true
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTodo = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTodo = {};
    });

    it('should respond with the updated todo', function() {
      updatedTodo.title.should.equal('Updated Todo');
      updatedTodo.done.should.equal(true);
    });

  });

  describe('DELETE /api/:todolistId/todos/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/' + todolist._id + '/todos/' + newTodo._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when thing does not exist', function(done) {
      request(app)
        .delete('/api/' + todolist._id + '/todos/' + newTodo._id)
        .set('authorization', 'Bearer ' + token)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
