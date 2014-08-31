(function () {
    "use strict";

    var GRID_COLUMN_HEIGHT_EVENT = 'gridColumn.updateColumnsHeight';
    var GRID_COLUMN_HEIGHT_DATA = 'gridColumn.commonColumnsHeight';

    var matchColumnsHeightDirective = ["$timeout", function ($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, iElem) {
                var parentElem, parentScope;

                parentElem = getParentElem(iElem);
                parentScope = parentElem.scope();

                updateColumnsHeight();

                scope.$on(GRID_COLUMN_HEIGHT_EVENT, function (event, height) {
                    updateColumnsHeight();
                });

                //****** Local functions ****
                function updateColumnsHeight() {
                    $timeout(function () {
                        var columnsActualHeight = parentElem.data(GRID_COLUMN_HEIGHT_DATA) || 0;
                        var elemHeight = iElem.height();

                        if (elemHeight > columnsActualHeight) {
                            columnsActualHeight = elemHeight;
                            parentElem.data(GRID_COLUMN_HEIGHT_DATA, elemHeight);
                            parentScope.$broadcast(GRID_COLUMN_HEIGHT_EVENT, elemHeight);
                        }

                        iElem.height(columnsActualHeight + 'px');
                    });
                }

                function getParentElem(elem) {
                    var parentElem = elem.parent('.grid-row, .grid-header');

                    if (!parentElem.length) {
                        throw new Error("grid column height fix Error: can not find parent row | header element.");
                    }
                    return parentElem;
                }
            }
        };
    }];

    angular.module("common.components")
        .directive("gridColumn", matchColumnsHeightDirective)
        .directive("gridHeaderColumn", matchColumnsHeightDirective);
})();