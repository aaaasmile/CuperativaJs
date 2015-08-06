// file: activate_contr_base.js

define([],
function () {

    var m_exports = {};

    m_exports.activate_state_ctor = function (prote) {
        // abstract method: get_contr_on_current_state
        var _log = log_ctor("activator");
        var that = prote || {};
        var _active_contr;
        var _root_name, _view_state, _parent_ctr, _map_state = {};

        that.init = function (root_name, parent_contr) {
            _root_name = root_name;
            _parent_ctr = parent_contr;
            _view_state = 'st_init';
        }

        that.map_state = function (name_st, contr) {
            if (!(name_st && contr)) {
                throw (new Error('Cannont map_state  ' + name_st + ' to control ' + contr));
            }
            if (_map_state.hasOwnProperty(name_st)){
                _log.warn('Override state ' + name_st);
            }
            _map_state[name_st] = contr;
        }

        that.change_state = function (new_state) {
            if (_view_state === new_state) {
                return;
            }
            _log.debug("Change state from " + _view_state + " to state " + new_state);
            _view_state = new_state;

            deactivate_old_activate_new_contr();
        }

        var deactivate_old_activate_new_contr = function () {
            if (typeof (_active_contr) !== 'undefined') {
                _active_contr.deactivate();
            }
            _active_contr = get_contr_on_current_state(_view_state);
            if (_active_contr) {
                _active_contr.activate({ root_ctrl: _root_name, parent_contr: _parent_ctr });
            } else {
                _log.error('No control for state' + _view_state);
            }
        }

        var get_contr_on_current_state = function (st) {
            res = _map_state[st];
            return res;
        }

        return that;
    }

    return m_exports;

});