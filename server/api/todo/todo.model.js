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

module.exports = mongoose.model('Todo', TodoSchema);
