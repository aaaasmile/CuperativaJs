require.config({
    //urlArgs: "bust=" + (new Date()).getTime(),  // evita problemi di cache in chrome quando si cambia i templates                                                
    paths: {
        core: '../../common/core',
        games: '../../common/games',
        common_libs: '../../common/libs'
    },
    shim: {
        // here is place for underscore and backbone if needed
    }
});

require(['common_libs/log',
         'common_libs/underscore-min',
         'common_libs/base_stuff'
 ], function () { 
     require(["app_route"],
        function (app) {
            //This function will be called when all the dependencies
            //listed above are loaded. Note that this function could
            //be called before the page is loaded.
            //This callback is optional.
            var _log = log_ctor("Main");
            _log.debug("Module initialized");

            app.init('mainapp');
        })
 });