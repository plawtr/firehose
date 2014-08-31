(function ( window ) {
    'use strict';

    function addScript(path) {
        document.write('<script type="text/javascript" src="' + path + '"></script>');
    }

    //      
    addScript('vendor/angular/angular.js');
    //      
    addScript('vendor/angular-ui-router/release/angular-ui-router.js');
    //      
    addScript('templates-app.js');
    //      
    addScript('templates-common.js');
    //      
    addScript('src/common/privateApi.js');
    //      
    addScript('src/common/common.js');
    //      
    addScript('src/common/components/components.js');
    //      
    addScript('src/common/config/config.js');
    //      
    addScript('src/common/services/services.js');
    //      
    addScript('src/common/services/secureApply/$secureApply.js');
    //      
    addScript('src/app/app.js');
    //      
    addScript('src/app/core/core.js');
    //      
    addScript('src/app/home/home.js');
    //      
    addScript('src/app/home/homeCtrl.js');
    //      

})( this );