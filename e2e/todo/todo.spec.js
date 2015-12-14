'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');
var common = require('../common');

describe('Main View', function() {
    var mainPage, login;

    var testUser = require('../testuser');

    beforeEach(function (done) {
        UserModel.removeAsync()
            .then(function () {
                return UserModel.createAsync(testUser);
            })
            .then(function () {
                browser.get(config.baseUrl + '/login');
                login = require('../account/login/login.po');
                return login.login(testUser);
            })
            .finally(done);
    });

    beforeEach(function(done) {
        common.waitForElement(by.id('todolistForm'));
        browser.get(config.baseUrl + '/').then(function() {
            mainPage = require('../main/main.po');
        }).then(function() {
            mainPage.formTitle.sendKeys('New Todo');
            mainPage.formSubmitBtn.click();
            return mainPage.getLastTodolist().click();
        }).then(done);
    });

    describe('when todolist selected', function() {
        var todoPage;

        beforeEach(function(done) {
            common.waitForElement(by.id('todoForm'));
            todoPage = require('./todo.po');
            done();
        });

        it('should be able to create a new todo', function() {
            var rowCount = 0;
            todoPage.countRows().then(function(rows) {
                rowCount = rows;
                todoPage.formTitle.sendKeys('New Todo');
                todoPage.formSubmitBtn.click();
                return todoPage.countRows();
            }).then(function(rows) {
                expect(rows).toEqual(rowCount + 1);
            });
        });

        it('should be able to remove a todo', function() {
            var rowCount = 0;
            todoPage.countRows().then(function(rows) {
                todoPage.formTitle.sendKeys('New Todo');
                todoPage.formSubmitBtn.click();
                return todoPage.countRows();
            }).then(function(rows) {
                rowCount = rows;
                todoPage.todoEl.all(by.xpath("//button[contains(text(),'Remove')]")).last().click();
                return todoPage.countRows();
            }).then(function(rows) {
                expect(rows).toEqual(rowCount - 1);
            });
        });
    });

});