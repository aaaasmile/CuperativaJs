// file: main_route.js

define(['activate_contr_base', 'controller/home_contr', 'g1/controller/brisc2_contr'],
function (md_act_base, md_home_ctr, md_brisc2_ctr) {
    var m_exports = {};
    var _log = log_ctor("main_route");
    var _activator = md_act_base.activate_state_ctor({});

    m_exports.init = function (root_name) {
        _activator.map_state('st_home', md_home_ctr);
        _activator.map_state('st_brisc2', md_brisc2_ctr);
        _activator.init(root_name, m_exports);

        $(document).ready(function () {
            _log.debug("Document ready.");
            //_activator.change_state('st_home');
            _activator.change_state('st_brisc2');
        });

    }

    m_exports.navigate_to_view = function (name) {
        switch (name) {
            case 'brisc2':
                _activator.change_state('st_brisc2');
                break;
            case 'home':
                _activator.change_state('st_home');
                break;
            default:
                _log.error('Navigation aborted to ' + name);
                break;
        }
    }

    return m_exports;
});

