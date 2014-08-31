describe("config", function () {
    var configProvider, config;

    beforeEach(module("common.config", ['configProvider', function (configProvider_) {
        configProvider = configProvider_;
    }]));

    beforeEach(inject(["config", function (config_) {
        config = config_;
    }]));

    describe("configProvider", function () {
        it("must be possible to set config properties using the config provider", function () {
            configProvider.put('configProperty', true);
            expect(configProvider.config).toEqual({configProperty: true});
            configProvider.put('mockOption', 'mockOpt');
            expect(configProvider.config).toEqual({configProperty: true, mockOption: 'mockOpt'});
        });

        it("must be possible to set complex property keys using '.' dots", function () {
            configProvider.put('commons.date.max', 1000);
            expect(configProvider.config.commons.date.max).toBe(1000);
        });

        it("must be possible to retrieve complex config properties that use dots", function () {
            configProvider.put('commons.date.max', 1000);
            expect(configProvider.get('commons.date.max')).toBe(1000);
        });

        it('must be possible to overwrite more than one config function at the same time', function () {
            configProvider.put('person', {
                name: 'John',
                surname: 'Doe',
                age: 16
            });

            configProvider.put('person', {
                name: 'Susan',
                age: 18
            });

            expect(configProvider.get('person')).toEqual({
                name: 'Susan',
                surname: 'Doe',
                age: 18
            });
        });
    });

    describe("config", function () {
        beforeEach(function () {
            configProvider.put('configProperty', true);
            configProvider.put('mockOption', 'mockOpt');
        });

        it("when called without a key argument it must return a copy of the config properties object", function () {
            var configProps = config();
            expect(configProps).toEqual({configProperty: true, mockOption: 'mockOpt'});
            configProps.name = "John Doe";
            expect(config()).toEqual({configProperty: true, mockOption: 'mockOpt'});
        });

        it("must be possible to retrieve config properties using simple and complex keys", function () {
            configProvider.put('commons.date.max', 1000);
            expect(config('commons.date.max')).toBe(1000);
            expect(config('configProperty')).toBe(true);
        });
    });
});