/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.form = element(by.id('todolistForm'));
  this.formTitle = this.form.element(by.model('main.newTodolist.title'));
  this.formSubmitBtn = this.form.element(by.css('button'));
  this.todolistEl = element(by.id('todolistContainer'));
  this.getLastTodolist = function() {
    return element(by.id('todolistContainer')).all(by.css('a')).last();
  }
};

module.exports = new MainPage();

