
define(function () {
    var m_exports = {};

    m_exports.trim = function (str) {
        return str.replace(/^\s+/, "").replace(/\s+$/, "");
    }

    m_exports.proc_counter_ctor = function (num_items, fun_cb) {
        var that = {};
        var _count = 0, _failed_items = 0, _ok_items = 0;
        var _log = log_ctor('proc_counter');

        that.item_done_ok = function () {
            _count += 1;
            _ok_items += 1;
            //_log.debug('*** item ok');
            if (_count >= num_items) {
                //_log.debug('all proc done ok, items:' + num_items);
                fun_cb(_failed_items, _ok_items);
            }
        }

        that.item_done_failed = function () {
            _count += 1;
            _failed_items += 1;
            if (_count >= num_items) {
                fun_cb(_failed_items, _ok_items);
            }
        }

        return that;
    }

    m_exports.proc_single_ctor = function (fun_cb) {
        return m_exports.proc_counter_ctor(1, fun_cb);
    }

    return m_exports;
});