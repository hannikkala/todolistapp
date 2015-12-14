'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var TodolistSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

TodolistSchema.pre('remove', function(next) {
  this.model('Todo').remove(
      {_id: {$in: this.todos}}
  ).exec();
  next();
});

module.exports = mongoose.model('Todolist', TodolistSchema);
