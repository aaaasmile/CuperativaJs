// file: test_eventuality.js

define(['core/action_event'], function (md_ev) {
    module("basic");
    var _log = log_ctor('test_ev');

    test("test eventuality", function () {
        var my = {}
        md_ev.eventuality(my);

        var par1 = { name: 'luz' };
        var par2 = 'myluz';


        my.subscribe('ciao', function (obj, nome) {
            _log.debug('Received event ciao, args: ' + JSON.stringify(obj) + ' par 2 ' + nome);
            equals(obj, par1, 'mi aspetto un oggetto');
            equals(nome, par2, 'mi aspetto una stringa');
        });


        _log.debug('Fire event');
        my.fire('ciao', par1, par2);
    });

});