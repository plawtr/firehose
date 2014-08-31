"use strict";

angular.module("firehose", ["common", "firehose.core", 'templates-app', 'ui.router'])
    .config(['$urlRouterProvider', function ($urlRouterProvider) {

        // Go to login by default
        $urlRouterProvider.otherwise('/home');

    }]);