var nullActiveColumn = {
    isActive: valueFn(true),
    activate: noop,
    deactivate: noop,
    transformData: identity
};

var nullGridCtrl = {
    processGridData: noop
};

var componentsModule = angular.module("common.components")
    .controller('gridHeaderRowController', [function () {
        var activeColumn = nullActiveColumn,
            grid = nullGridCtrl,
            self = this;

        this.init = function (gridController) {
            grid = gridController;
            grid.addDataTransformer(function processData (data) {
                return activeColumn.transformData(data);
            });
            grid.processGridData();
        };

        this.activateColumn = function (column) {
            if (activeColumn !== column) {
                activeColumn.deactivate();
                column.activate();
                activeColumn = column;
                grid.processGridData();
            }
        };

        this.processGridData = function(){
            grid.processGridData();
        };
    }])
    .directive("gridHeaderRow", [ function () {
        return {
            restrict: 'EA',
            require: ['^grid', 'gridHeaderRow'],
            controller: 'gridHeaderRowController',
            compile: function(tElem, tAttrs){
                tElem.addClass('grid-header');

                return function (scope, iElem, iAttrs, ctrls) {
                    var grid = ctrls[0],
                        headerRow = ctrls[1];

                    headerRow.init(grid);
                }
            }
        };
    }]);