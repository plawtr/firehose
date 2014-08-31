(function ( window ) {
    'use strict';

    function addScript(path) {
        document.write('<script type="text/javascript" src="' + path + '"></script>');
    }

    //      <% files.forEach( function ( file ) { %>
    addScript('<%= file %>');
    //      <% }); %>

})( this );