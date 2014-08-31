"use strict";

angular.module("firehose", ["common", "firehose.core", 'templates-app', 'ui.router'])
    .config(['$urlRouterProvider', 'configProvider', function ($urlRouterProvider, config) {

        // Go to login by default
        $urlRouterProvider.otherwise('/home');

    }]);