"use strict";

beforeEach(function () {
    jasmine.addMatchers({
        toBeAPromise: function () {
            return {
                compare: function (actual, expected) {
                    var result = {
                        pass: isFunction(actual.then)
                    };

                    if(result.pass) {
                        result.message = "Expected element " + actual + " NOT to be a promise (promises have a 'then' function)"
                    } else {
                        result.message = "Expected element " + actual + "to be a promise (promises have a 'then' function)"
                    }
                    return result;
                }
            };
        }
    });
});