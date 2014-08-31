"use strict";

angular.module("$location.mock", []).factory('$location', function(){
    return jasmine.createSpyObj('$location', ['search']);
});