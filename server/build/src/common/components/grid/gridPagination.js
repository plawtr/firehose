angular.module("common.components").directive("gridPagination", [ function () {
    return {
        restrict: 'A',
        template: '<div class="grid-pagination">' +
                    '<center>' +
                        '<pagination boundary-links="true" total-items="$getGridDataSize();" ng-model="$page.currentPage" ' +
                        'class="pagination-sm footerPag" previous-text="&lsaquo;" next-text="&rsaquo;" ' +
                        'first-text="&laquo;" last-text="&raquo;" items-per-page="$pageSize" ></pagination>' +
                    '</center>' +
                   '</div>',
        require: '^grid',
        replace:true,
        scope:true,
        link: function (scope, iElem, iAttrs, grid) {
            scope.$page = {
                currentPage: 1
            };

            scope.$watch('$page.currentPage', function(){
                grid.processGridData();
            });

            grid.addDataTransformer(updatePageItems);

            //***** Local functions ****
            function updatePageItems(items){
                return filterByPage(items, scope.$page.currentPage, scope.$pageSize);
            }

            function filterByPage(items, currentPage, pageSize) {
                var filteredItems = [],
                    pageStart = (currentPage - 1) * pageSize,
                    pageEnd = pageStart + pageSize;

                for (var i = 0, len = items.length; i < len; i += 1) {
                    if (i >= pageStart && i < pageEnd) {
                        filteredItems.push(items[i]);
                    }
                }
                return filteredItems;
            }
        }
    };
}]);