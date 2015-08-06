(function (window) {
    var log_ctor = function (name_type) {
        var that = {};
        var _name_type = name_type;

        var log = function () {
            if (typeof (console) !== "undefined") {
                return {
                    debug: function (msg) {
                        console.log("[DBG]" + msg);
                    },
                    warn: function (msg) {
                        console.log("[WRN]" + msg);
                    },
                    error: function (msg) {
                        console.log("[ERR]" + msg);
                    },
                    info: function (msg) {
                        console.log("[INFO]" + msg);
                    },
                    change_nametype: function (newname) {
                        _name_type = newname;
                    }
                };
            }
            return {
                debug: function (msg) {
                },
                warn: function (msg) {
                },
                error: function (msg) {
                },
                info: function (msg) {
                },
                change_nametype: function (newname) {
                }
            }
        } ();

        that.debug = function (msg) {
            log.debug("[" + _name_type + "]" + msg);
        }

        that.warn = function (msg) {
            log.warn("[" + _name_type + "]" + msg);
        }

        that.error = function (msg) {
            log.error("[" + _name_type + "]" + msg);
        }

        that.info = function (msg) {
            log.info("[" + _name_type + "]" + msg);
        }

        that.change_nametype = function (newname) {
            log.change_nametype(newname);
        }

        return that;
    }

    _log = log_ctor('test_noqunit');
    QUnit = { config: {} };
    module = function (name) { };
    equals = function (a, b, desc) {
        if (a === b) {
            _log.debug('OK test ' + desc + ' expected value ' + a);
        } else { console.log('ERROR on ' + desc + ' expected value is ' + b + ' but it was ' + a); }
    };

    var _listTest = [];
    test = function (name, fn, bInsert) {
        if (bInsert) {
            _log.debug('Recognized test: ' + name);
            _listTest.push({ fn: fn, name: name });
        } else {
            _log.debug('Do not call: ' + name);
        }
    }


    QUnit.start = function () {
        _log.debug('Start to call all tests');
        for (var i = 0; i < _listTest.length; i++) {
            _log.debug('Start: ' + _listTest[i].name)
            _listTest[i].fn();
        }
    }

    window.QUnit = QUnit;
    window.module = module;
    window.equals = equals;
    window.test = test;
})(window);