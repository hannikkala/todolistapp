/**
 * Thing model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Todo = require('./todo.model.js');
var TodoEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TodoEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Todo.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TodoEvents.emit(event + ':' + doc._id, doc);
    TodoEvents.emit(event, doc);
  }
}

module.exports = TodoEvents;
