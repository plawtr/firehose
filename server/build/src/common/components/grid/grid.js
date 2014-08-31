angular.module("common.components")
    .controller("gridController", ["$scope", "$attrs", function ($scope, $attrs) {
        var ngRepeatExp, dataExp, sourceData, gridData,
            transformers = [];

        ngRepeatExp = getNgRepeatExp($attrs);
        dataExp = getDataExp(ngRepeatExp);

        processGridData();
        $scope.$watch(dataExp, function (value) {
            sourceData = value || [];
            processGridData();
        });

        this.ngRepeatExp = ngRepeatExp.replace(dataExp, "$gridData");
        this.addDataTransformer = function (transformer) {
            if (!isFunction(transformer)) {
                throw new Error("gridController.addDataTransformer Error: expected a function but got : '" + transformer + "'");
            }
            transformers.push(transformer);
            processGridData();
        };

        this.processGridData = processGridData;

        if ($attrs.itemsPerPage) {
            $scope.$pageSize = 0;
            $scope.$watch($attrs.itemsPerPage, function (pageSize) {
                if (isNumber(pageSize)) {
                    $scope.$pageSize = pageSize;
                    processGridData();
                }
            });

            $scope.$getGridDataSize = function () {
                return sourceData ? sourceData.length : 0;
            }
        }

        //****** Local functions ***
        function processGridData() {
            var gridData = copy(sourceData) || [];
            forEach(transformers, function (transformer) {
                gridData = transformer(gridData) || [];
            });
            $scope.$gridData = gridData;
        }

        function getNgRepeatExp($attrs) {
            assertNgRepeatExpIsDefined($attrs.ngRepeatExp);
            return $attrs.ngRepeatExp
        }

        function assertNgRepeatExpIsDefined(ngRepeatExp) {
            if (!isString(ngRepeatExp) || ngRepeatExp === "") {
                throw new Error("gridController Error: ng-repeat-exp is a required attr");
            }
        }

        function getDataExp(ngRepeatExp) {
            var match = ngRepeatExp.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            return match[2];
        }
    }])
    .directive('grid', [ function () {
        return {
            restrict: 'EA',
            controller: 'gridController',
            scope: true,
            compile: function (tElem, tAttrs, ctrl) {
                tElem.addClass('grid');
                if (tAttrs.itemsPerPage) {
                    tElem.append(element('<div grid-pagination></div>'));
                }
            }
        };
    }]);