'use strict';

var app = require('../..');
var request = require('supertest');
var requestPromised = require('supertest-as-promised');
var User = require('../user/user.model');
var Todolist = require('./todolist.model');
var Todo = require('../todo/todo.model');

var newTodolist;

describe('Todolist API:', function() {
  var user, token;

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

  // Clear users after testing
  after(function() {
    return User.removeAsync();
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

  describe('GET /api/todolists', function() {
    var todolists;

    beforeEach(function(done) {
      request(app)
        .get('/api/todolists')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          todolists = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      todolists.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/todolists', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/todolists')
        .set('authorization', 'Bearer ' + token)
        .send({
          title: 'New Todolist'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newTodolist = res.body;
          done();
        });
    });

    it('should respond with the newly created todolist', function() {
      newTodolist.title.should.equal('New Todolist');
    });

  });

  describe('GET /api/todolists/:id', function() {
    var todolist;

    beforeEach(function(done) {
      request(app)
        .get('/api/todolists/' + newTodolist._id)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          todolist = res.body;
          done();
        });
    });

    afterEach(function() {
      todolist = {};
    });

    it('should respond with the requested todolist', function() {
      todolist.title.should.equal('New Todolist');
    });

  });

  describe('PUT /api/todolists/:id', function() {
    var updatedTodolist;

    beforeEach(function(done) {
      request(app)
        .put('/api/todolists/' + newTodolist._id)
        .set('authorization', 'Bearer ' + token)
        .send({
          title: 'Updated Todolist'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTodolist = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTodolist = {};
    });

    it('should respond with the updated todolist', function() {
      updatedTodolist.title.should.equal('Updated Todolist');
    });

  });

  describe('DELETE /api/todolists/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/todolists/' + newTodolist._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when todolist does not exist', function(done) {
      request(app)
        .delete('/api/todolists/' + newTodolist._id)
        .set('authorization', 'Bearer ' + token)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should remove all todos attached to a todolist', function(done) {
      var todolist;

      Todo.find({}).removeAsync().then(function() {
        return Todo.create({
          title: 'Test todo',
          done: false
        }, {
          title: 'Demo todo 2',
          done: false
        }).then(function(todo1, todo2) {
          return Todolist.find({}).removeAsync().then(function() {
            return Todolist.create({
              title: 'Demo list',
              user: user,
              todos: [todo1, todo2]
            }).then(function(tl) {
              todolist = tl;
            });
          });
        });
      }).then(function() {
        requestPromised(app)
            .delete('/api/todolists/' + todolist._id)
            .set('authorization', 'Bearer ' + token)
            .expect(204)
            .then(function() {
              Todo.find({}).execAsync().then(function(todos) {
                todos.length.should.equal(0);
                done();
              });
            });
      });

    });

  });

});
