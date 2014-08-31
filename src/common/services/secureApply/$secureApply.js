angular.module("common.services").factory("$secureApply", ["$rootScope", function($rootScope){
    return function secureApply(fn){
        (fn || noop)();
        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        }
    }
}]);