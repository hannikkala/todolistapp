'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  done: Boolean
});

TodoSchema.pre('remove', function(next) {
  this.model('Todolist').update(
      { todos: this._id },
      { $pull: { todos: this._id } },
      { multi: true },
      next
  );
});

module.exports = mongoose.model('Todo', TodoSchema);
