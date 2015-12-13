'use strict';

var TodoPage = function() {
    var self = this;
    this.form = element(by.id('todoForm'));
    this.formTitle = this.form.element(by.model('todoCtrl.newTodo.title'));
    this.formSubmitBtn = this.form.element(by.css('button'));
    this.todoEl = element(by.id('todoList'));
    this.countRows = function() {
        return self.todoEl.all(by.css('.row')).count();
    };
};

module.exports = new TodoPage();