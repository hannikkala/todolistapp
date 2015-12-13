/**
 * Todolist model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Todolist = require('./todolist.model');
var TodolistEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TodolistEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Todolist.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TodolistEvents.emit(event + ':' + doc._id, doc);
    TodolistEvents.emit(event, doc);
  }
}

module.exports = TodolistEvents;
