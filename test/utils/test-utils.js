"use strict";

var injector = angular.injector(['ng']);
var $sniffer = injector.get('$sniffer');


window.compileFn = function compileFn($compile, $scope, $document) {
    return function (html, values) {
        values = values || {};
        var elm = $compile(html)(extend($scope, values));
        $scope.$apply();

        if ($document) {
            getContainer($document).append(elm);
        }

        return elm;
    };

    //****** Local Functions ******
    function getContainer($document) {
        var body = element($document[0].body),
            containerDiv = element('div.container', body);

        if (containerDiv.length > 0) {
            containerDiv.empty();
        } else {
            containerDiv = element('<div class="container"></div>');
            body.append(containerDiv);
        }

        return containerDiv;
    }
};

window.decorateSpyWithPromiseResult = function decorateSpyWithPromiseResult($q, jasmineSpy) {
    var defer = $q.defer();
    jasmineSpy.defer = defer;
    jasmineSpy.and.returnValue(defer.promise);
};


window.chnageInputValue = function changeInputValue(input, value) {
    input = angular.element(input);
    input.val(value);
    input.trigger($sniffer.hasEvent('input') ? 'input' : 'change'); // we trigger this event so that angular knows that the input has changed.
    input.trigger('keydown'); // we trigger this event so that angular knows that the input has changed.
};


window.selectOption = function selectOption(select, optionValue) {
    select.val(optionValue).change();
};

window.mousedownEvent = function mousedownEvent(target) {
    return mouseEvent('mousedown', target);
};

window.mouseEvent = function mouseEvent(type, target) {
    var e = jQuery.Event(type);
    e.target = target;
    return e;
};