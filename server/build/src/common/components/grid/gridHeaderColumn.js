angular.module("common.components")
    .controller("gridHeaderColumnController", ["$scope", function ($scope) {
        var stateIsActive = false,
            dataTransformers = [];

        this.isActive = function () {
            return stateIsActive;
        };

        this.activate = function () {
            stateIsActive = true;
            $scope.$emit("GridHeaderColumn.activated");
        };

        this.deactivate = function () {
            stateIsActive = false;
            $scope.$emit("GridHeaderColumn.deactivated");
        };

        this.transformData = function (data) {
            var transformedData = data;
            forEach(dataTransformers, function (transform) {
                transformedData = transform(transformedData) || [];
            });
            return transformedData;
        };

        this.addDataTransformer = function (transformer) {
            if (!isFunction(transformer)) {
                throw new Error("gridHeaderColumnController.addDataTransformer Error: The passed transformer must be a function that receives a data array and returns the transformed array");
            }
            dataTransformers.push(transformer)
        };
    }])
    .directive("gridHeaderColumn", ["$filter", function ($filter) {
        var orderBy = $filter('orderBy');
        var sorting = {
            ASC: "ASC",
            DSC: "DSC"
        };

        return {
            restrict: 'EA',
            require: ["^gridHeaderRow", "gridHeaderColumn"],
            template: '<div class="grid-column grid-cell row-fluid" ng-class="{active: isActive()}">' +
                //Note: this a element below is there because older browsers like IE8 do not support click events on div elements
                '<a ng-click="activateColumn()" class="clearfix">' +
                '<div class="content span11" ng-transclude></div>' +
                '<div class="sorting span1" ng-if="orderBy">' +
                '<i class="fa fa-caret-up ASC" ng-class="{\'active-sorting\': isAscendingSorting()}" ></i>' +
                '<i class="fa fa-caret-down DSC"  ng-class="{\'active-sorting\': isDescendingSorting()}" ></i>' +
                '</div>' +
                '</a>' +
                '</div>',
            transclude: true,
            replace: true,
            scope: {
                orderBy: '=orderBy'
            },
            controller: "gridHeaderColumnController",
            link: function (scope, iElem, iAttrs, ctrls) {
                var gridHeaderRow = ctrls[0],
                    gridHeaderColumn = ctrls[1],
                    activeSorting = null;

                scope.isActive = gridHeaderColumn.isActive;

                scope.activateColumn = function () {
                    if (!gridHeaderColumn.isActive()) {
                        gridHeaderRow.activateColumn(gridHeaderColumn);
                    }
                    toggleActiveSorting();
                    gridHeaderRow.processGridData();
                };

                scope.$on("GridHeaderColumn.deactivated", function () {
                    activeSorting = null;
                });

                if (scope.orderBy) {
                    gridHeaderColumn.addDataTransformer(function (data) {
                        return orderBy(data, scope.orderBy, activeSorting === sorting.DSC);
                    });

                    scope.isAscendingSorting = function () {
                        return activeSorting === sorting.ASC;
                    };

                    scope.isDescendingSorting = function () {
                        return activeSorting === sorting.DSC;
                    };
                }

                //**** Local functions ******
                function toggleActiveSorting() {
                    activeSorting = sorting.ASC === activeSorting ? sorting.DSC : sorting.ASC;
                }
            }
        };
    }]);