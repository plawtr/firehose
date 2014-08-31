describe("$secureApply", function(){
    var $secureApply, $rootScope;

    beforeEach(module("common.services"));
    beforeEach(inject(["$rootScope", "$secureApply", function ($rootScope_, $secureApply_) {
        $rootScope = $rootScope_;
        $secureApply = $secureApply_;
        spyOn($rootScope, '$apply').and.callThrough();
    }]));

    it("must execute the passed fn", function () {
        //Arrange
        var fooFn = jasmine.createSpy('fooFn');

        //Act
        $secureApply(fooFn);

        //Assert
        expect(fooFn).toHaveBeenCalled();
        expect(fooFn.calls.count()).toBe(1);
    });

    it("must call $rootScope.$apply() if there is no $digest in progress", function () {
        //Arrange
        var fooFn = jasmine.createSpy('fooFn');

        //Act
        $secureApply(fooFn);

        //Assert
        expect(fooFn).toHaveBeenCalled();
        expect($rootScope.$apply).toHaveBeenCalled();
        expect($rootScope.$apply.calls.count()).toBe(1);
    });

    it("must NOT call $rootScope.$apply() if there is a $digest phase already in progress", function () {
        //Arrange
        var fooFn = jasmine.createSpy('fooFn');

        //Act
        $rootScope.$apply(function(){
            $rootScope.$apply.calls.reset();
            $secureApply(fooFn);
        });

        //Assert
        expect(fooFn).toHaveBeenCalled();
        expect($rootScope.$apply).not.toHaveBeenCalled();
        expect($rootScope.$apply.calls.count()).toBe(0);
    });
});