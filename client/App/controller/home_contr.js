// file: home_contr.js


define(["view/home_view"],
function (md_view) {
    var _log = log_ctor("home_contr"), _root_name;
    var _parentNavigator;
    var m_exports = {};

    m_exports.activate = function (opt) {
        _root_name = opt.root_ctrl;
        opt.controller_view = m_exports;
        _parentNavigator = opt.parent_contr;
        md_view.activate(opt);
        _log.debug("Activate");
    }

    m_exports.deactivate = function () {
        md_view.deactivate();
        _log.debug("Deactivate");
    }

    m_exports.navigate_to_game = function (name) {
        _parentNavigator.navigate_to_view(name);
    }

    m_exports.get_name = function () {
        return "home Controller";
    }

    m_exports.process_srv_msg = function (msg) {

    }

    return m_exports;
}
);
