angular.module("common.components")
    .directive('gridRow', ["$compile", function ($compile) {
        //noinspection FunctionWithInconsistentReturnsJS
        return {
            restrict: "EA",
            require: '^grid',
            compile: function (tElem, tAttrs) {
                if (isAlreadyCompiled(tElem)) {
                    return;
                }

                var rowElem = tElem;
                tElem.replaceWith(element(document.createComment(' gridRow: grid-row ')));

                return function link(scope, iElem, iAttrs, grid) {
                    var template = buildRowsTemplate(grid.ngRepeatExp, rowElem);
                    var rows = $compile(template)(scope);
                    iElem.replaceWith(rows);
                };
            }
        };

        //***** Local functions ****
        function buildRowsTemplate(ngRepeatExp, row) {
            row.addClass("grid-row");
            row.addClass('clearfix');
            row.attr('ng-repeat', ngRepeatExp);
            row.attr('ng-class', "{even: $even, odd: $odd}");
            markAsCompiled(row);
            return row
        }

        function markAsCompiled(row) {
            row.attr('grid-row-already-compiled', true);
        }

        function isAlreadyCompiled(row) {
            return row.attr('grid-row-already-compiled');
        }
    }]);