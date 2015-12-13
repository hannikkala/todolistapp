'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');
var common = require('../common');

describe('Main View', function() {
  var page, login;

  var testUser = require('../testuser');

  beforeEach(function(done) {
    UserModel.removeAsync()
        .then(function() {
          return UserModel.createAsync(testUser);
        })
        .then(function() {
          browser.get(config.baseUrl + '/login');
          login = require('../account/login/login.po');
          return login.login(testUser);
        })
        .finally(done);
  });

  describe('when authenticated', function() {

      beforeEach(function(done) {
          common.waitForElement(by.id('todolistForm'));
          browser.get(config.baseUrl + '/').then(function() {
            page = require('./main.po');
          }).then(done);
      });

      it('should add a new todo list', function() {
        var rowCount = 0;
        page.todolistEl.all(by.css('.row')).count().then(function(rows) {
          rowCount = rows;
          page.formTitle.sendKeys('New Todo');
          return page.formSubmitBtn.click();
        }).then(function() {
          return page.todolistEl.all(by.css('.row')).count();
        }).then(function(rows) {
          expect(rows).toEqual(rowCount + 1);
        });
      });

      it('should be able to edit todolist', function() {
          page.formTitle.sendKeys('New Todo');
          page.formSubmitBtn.click().then(function() {
            return page.todolistEl.all(by.xpath("//button[contains(text(),'Edit')]")).last().click();
          }).then(function() {
              expect(page.formTitle.getAttribute('value')).toEqual('New Todo');
              page.formTitle.clear();
              page.formTitle.sendKeys('Updated Todo');
              return page.formSubmitBtn.click();
          }).then(function() {
              expect(page.todolistEl.all(by.css('.row')).last().element(by.css('.col-lg-10')).getText()).toEqual('Updated Todo');
          });
      });

      it('should be able to remove todolist', function() {
          var rowCount = 0;
          page.formTitle.sendKeys('New Todo');
          page.formSubmitBtn.click().then(function() {
              return page.todolistEl.all(by.css('.row')).count();
          })
          .then(function (rows) {
              rowCount = rows;
              return page.todolistEl.all(by.xpath("//button[contains(text(),'Remove')]")).last().click();
          }).then(function() {
              return page.todolistEl.all(by.css('.row')).count();
          }).then(function(rows) {
              expect(rows).toEqual(rowCount - 1);
          });
      });
  });
});
