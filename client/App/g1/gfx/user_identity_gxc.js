// file user_identity_gxc.js

define([],
function () {
    var m_exports = {};

    m_exports.user_ident_gfx_ctor = function () {
        var that = {};
        var _root_selector;

        that.add_user_lbl = function (div_name, name_user, css_obj) {
            _root_selector = '#' + div_name;
            $(_root_selector).append(name_user);
            $(_root_selector).css(css_obj);
        }

        that.user_is_on_turn = function () {
            $(_root_selector).addClass('g-name_onturn');
        }

        that.user_is_waiting = function () {
            $(_root_selector).removeClass('g-name_onturn');
        }

        return that;
    }

    return m_exports;
});