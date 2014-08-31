angular.module("common.components")
    .directive("gridColumn", [ function () {
        return {
            restrict: 'EA',
            compile: function (tElem, tAttrs) {
                tElem.addClass('grid-column');
                tElem.addClass('grid-cell');
            }
        };
    }]);