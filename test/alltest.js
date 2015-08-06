// file: alltest.js

QUnit.config.autostart = false;
requirejs.config({
    paths: {
        core: '../common/core',
        games: '../common/games'
    }
});

require([
    '../common/libs/log.js',
    '../common/libs/base_stuff.js',
    '../common/libs/underscore-min.js' // use it whitout shim
], function (log) {
    require([
    'briscola/test_core_briscola.js'
    //'test_eventuality.js',
    //'test_generic_core.js'
    ], function () {
        QUnit.start();
    });
});