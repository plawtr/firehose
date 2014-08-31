angular.module('common.config', []).provider('config', function () {
    var SEPARATOR = '.';
    var config = {};
    var self = this;

    this.config = config;

    this.get = function getProperty(key) {
        var names = key.split(SEPARATOR);
        var value = config;
        forEach(names, function (name) {
            value = value[name];
        });

        return copy(value);
    };

    this.put = function setProperty(key, value) {
        var keys = key.split(SEPARATOR),
            lastKey = removeLast(keys),
            o = createNamespace(keys, config);

        if (isObject(o[lastKey]) && isObject(value)) {
            o[lastKey] = extend(o[lastKey], value);
        } else {
            o[lastKey] = value;
        }
    };

    this.$get = [function () {
        return function (key) {
            return key ? self.get(key) : copy(config);
        };
    }];

    //********* Local Functions *********
    function removeLast(array) {
        return array.splice(array.length - 1, 1);
    }

    function createNamespace(keys, container) {
        var o = container;
        forEach(keys, function (name) {
            o = o[name] = o[name] || {};
        });
        return o;
    }

});