'use strict';

angular.module('unitytodoApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('todo', {
                url: '/todolists/:todolistId',
                templateUrl: 'app/todo/todo.html',
                controller: 'TodoCtrl',
                controllerAs: 'todoCtrl',
                authenticate: true
            });
    });
