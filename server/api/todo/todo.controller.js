/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/todos              ->  index
 * POST    /api/todos              ->  create
 * GET     /api/todos/:id          ->  show
 * PUT     /api/todos/:id          ->  update
 * DELETE  /api/todos/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var Todo = require('./todo.model.js');
var Todolist = require('../todolist/todolist.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Things
exports.index = function(req, res) {
  Todolist.find({_id: req.params.todoListId, user: req.user._id})
    .populate('todos')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Todo from the DB
exports.show = function(req, res) {
  Todo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Thing in the DB
exports.create = function(req, res) {
  if(!req.body || req.body.title === '') {
    res.status(400).end();
    return;
  }

  Todo.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .then(function(todo) {
        Todolist.findById(req.params.todolistId)
          .populate('todos')
          .execAsync()
          .then(function(todolist) {
            var todos = todolist.todos || [];
            todos.push(todo);
            todolist.todos = todos;
            todolist.saveAsync();
          });
        return function(todo) {
          return todo;
        };
      })
    .catch(handleError(res));


};

// Updates an existing Thing in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Todo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Thing from the DB
exports.destroy = function(req, res) {
  Todo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
