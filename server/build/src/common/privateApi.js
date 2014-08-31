var forEach = angular.forEach,
    isString = angular.isString,
    isArray = angular.isArray,
    isDate = angular.isDate,
    isElement = angular.isElement,
    isObject = angular.isObject,
    isFunction = angular.isFunction,
    isNumber = angular.isNumber,
    element = angular.element,
    noop = angular.noop,
    equals = angular.equals,
    identity = angular.identity,
    extend = angular.extend,
    copy = angular.copy,
    toJson = angular.toJson,
    fromJson = angular.fromJson,
    isDefined = angular.isDefined,
    isUndefined = angular.isUndefined,
    bind = angular.bind;


function throwErrorCurryFn(errMsg){
    return function (err){
        throw new Error(errMsg, err);
    }
}