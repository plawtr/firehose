"use strict";

angular.module("firehose")
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'app/home/home.tpl.html',
            controller: 'homeCtrl'
        });
    }]);